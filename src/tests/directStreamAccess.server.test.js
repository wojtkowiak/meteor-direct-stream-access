const expect = chai.expect;
let methodExecuted = false;

function fakeClient(callback) {
    makeTestConnection(
        chai.assert,
        (client) => callback(client),
        () => {
            Meteor.directStream._messageHandlers = [];
        }
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
                const check = Meteor.server.stream_server.registration_callbacks.some(
                    (callback) => callback.name === 'directStreamAccessSocketHandler'
                );
                expect(check).to.be.true();
            });
        });

        describe('#onMessage()', () => {
            let testDone;
            const messageHandler = (message) => {
                if (~message.indexOf('"msg":"connect"')) {
                    testDone();
                }
            };

            before(() => {
                Meteor.directStream.onMessage(messageHandler);
            });

            it('should register callback and receive messages', (done) => {
                testDone = done;
                // We need to generate some traffic on the websocket. Connection from a fake
                // client will be sufficient.
                fakeClient((client) => client.disconnect());
            });
            after(() => {
                Meteor.directStream._messageHandlers = [];
            });
        });

        describe('#preventCallingMeteorHandler', () => {
            let debug;

            before(() => {
                Meteor.directStream.onMessage(function messageHandler(message) {
                    // Selectively prevent Meteor's handler only on call
                    // to `methodThatShouldNotBeExecuted`.
                    if (~message.indexOf('methodThatShouldNotBeExecuted')) {
                        this.preventCallingMeteorHandler();
                    }
                });
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
                    Meteor.defer(
                        // Call to the `dummyMethod` should succeed.
                        () => client.call(
                            'dummyMethod',
                            () => {
                                client.disconnect();
                                expect(methodExecuted).to.be.false();
                                done();
                            }
                        )
                    );
                    client.call('methodThatShouldNotBeExecuted');
                });
            });
            after(() => {
                // Clean up the handlers.
                Meteor.directStream._messageHandlers = [];
                if (Meteor.isClient) {
                    Meteor._debug = debug;
                }
            });
        });
    });
}
