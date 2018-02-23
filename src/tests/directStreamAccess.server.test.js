import chai from 'ultimate-chai';

const { expect } = chai;
let methodExecuted = false;

function fakeClient(callback, handler) {
    makeTestConnection(
        chai.assert,
        client => callback(client),
        () => delete Meteor
            .directStream
            ._messageHandlers[Meteor.directStream._messageHandlers.indexOf(handler)]
    );
}

if (Meteor.isServer) {
    Meteor.methods({
        methodThatShouldNotBeExecuted: () => {
            methodExecuted = true;
        }
    });

    describe('DirectStreamAccess', () => {
        describe('#_install()', () => {
            it('should install itself properly', () => {
                // Check if our callback is in place.
                const check = Meteor
                    .server
                    .stream_server
                    .registration_callbacks
                    .some(callback => callback.name === 'directStreamAccessSocketHandler');

                expect(check).to.be.true();
            });
        });

        describe('#onMessage()', () => {
            let testDone;
            const onMessageMessageHandler = (message) => {
                if (~message.indexOf('"msg":"connect"')) {
                    testDone();
                }
            };

            before(() => {
                Meteor.directStream.onMessage(onMessageMessageHandler);
            });

            it('should register callback and receive messages', (done) => {
                testDone = done;
                // We need to generate some traffic on the websocket. Connection from a fake
                // client will be sufficient.
                fakeClient(client => client.disconnect());
            });
            after(() => {
                delete Meteor
                    .directStream
                    ._messageHandlers[
                        Meteor.directStream._messageHandlers.indexOf(onMessageMessageHandler)
                    ];
            });
        });

        describe('#preventCallingMeteorHandler', () => {
            function messageHandler(message) {
                // Selectively prevent Meteor's handler only on call
                // to `methodThatShouldNotBeExecuted`.
                if (~message.indexOf('methodThatShouldNotBeExecuted')) {
                    this.preventCallingMeteorHandler();
                }
            }

            before(() => {
                Meteor.directStream.onMessage(messageHandler);
            });
            it('should prevent a meteor method from running', (done) => {
                /**
                 * To prove that it works, we will try to block an invocation of Meteor's method.
                 * This does not makes any sense for a real world usage,
                 * but for a test it is fine :)
                 */
                fakeClient((client) => {
                    // Because synchronous call to `methodThatShouldNotBeExecuted` will stall here,
                    // we will defer the check.
                    // Call to the `dummyMethod` should succeed.
                    Meteor.defer(() => client.call(
                        'dummyMethod',
                        () => {
                            client.disconnect();
                            expect(methodExecuted).to.be.false();
                            done();
                        }
                    ));
                    client.call('methodThatShouldNotBeExecuted');
                }, messageHandler);
            });
            after(() => {
                // Clean up the handlers.
                delete Meteor
                    .directStream
                    ._messageHandlers[
                        Meteor.directStream._messageHandlers.indexOf(messageHandler)
                    ];
            });
        });

        describe('#onMessage with userId', () => {
            let receivedUserId;
            let finishTest;
            const userIdMessageHandler = function userIdMessageHandler(message, sessionId, userId) {
                if (~message.indexOf('dummyMethod')) {
                    receivedUserId = userId;
                    this.preventCallingMeteorHandler();
                    this.stopProcessingHandlers();
                    if (finishTest) { finishTest(); }
                }
            };

            before(() => {
                Meteor.directStream.onMessage(userIdMessageHandler);
            });

            it('should have userId', (done) => {
                finishTest = () => {
                    expect(receivedUserId === Meteor.__testEnv.userId).to.be.true();
                    done();
                };
                fakeClient((client) => {
                    client.call('login', {
                        user: { username: 'test' },
                        password: 'test'
                    });
                    client.call('dummyMethod');
                }, userIdMessageHandler);
            });
            after(() => {
                delete Meteor
                    .directStream
                    ._messageHandlers[
                        Meteor.directStream._messageHandlers.indexOf(userIdMessageHandler)
                    ];
            });
        });
    });
}
