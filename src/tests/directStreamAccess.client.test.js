import chai from 'ultimate-chai';

const { expect } = chai;

if (Meteor.isServer) {
    Meteor.methods({
        methodWithSpecifiedResponse: (response) => response
    });
}

if (Meteor.isClient) {
    describe('DirectStreamAccess', () => {
        describe('#_install()', () => {
            it('should install itself properly', () => {
                expect(Meteor.connection.___directStreamInstalled).to.be.true();
            });
        });

        describe('#registerConnection()', () => {
            it('should return id', () => {
                const mainId = Meteor.directStream._mainConnectionId;
                expect(Meteor.directStream.registerConnection(Meteor.connection)).to.be.equal(mainId);
            });
        });

        describe('#onMessage()', () => {
            let testDone;
            const messageHandler = (message) => {
                if (~message.indexOf('testResponse')) {
                    testDone();
                }
            };

            before(() => {
                // We will register the wrapped `testDone` callback as a message handler so once
                // its called it will also finish the test.
                Meteor.directStream.onMessage(messageHandler);
            });
            it('should register callback and receive messages', (done) => {
                testDone = done;
                // We need to generate some traffic on the websocket. We will call a method to
                // get a response message.
                Meteor.call('methodWithSpecifiedResponse', 'testResponse');
            });
            after(() => {
                delete Meteor
                    .directStream
                    ._messageHandlers[Meteor.directStream._messageHandlers.indexOf(messageHandler)];
            });
        });

        describe('#preventCallingMeteorHandler', () => {
            let debug;
            function messageHandler(message) {
                // Selectively prevent Meteor's handler only on message `test`.
                if (message === 'test') {
                    this.preventCallingMeteorHandler();
                }
            }

            before(() => {
                Meteor.directStream.onMessage(messageHandler);
                debug = Meteor._debug;
            });

            it('should prevent a meteor method from running', (done) => {
                let debugCalled = false;
                /*
                 * We will check if Meteor will complain about invalid JSON through
                 * the Meteor._debug method.
                 * Since we are blocking the message `test` from being processed by Meteor,
                 * only `test2` should land in the _debug method.
                 */
                Meteor._debug = function _debug(...params) {
                    if (typeof params[1] === 'string') {
                        expect(params[1]).to.be.equal('test2');
                        debugCalled = true;
                    }
                };
                Meteor.call('sendMessageFromServerToClient', 'test');
                Meteor.call('sendMessageFromServerToClient', 'test2', () => {
                    expect(debugCalled).to.be.true();
                    done();
                });
            });

            after(() => {
                delete Meteor
                    .directStream
                    ._messageHandlers[Meteor.directStream._messageHandlers.indexOf(messageHandler)];
                Meteor._debug = debug;
            });
        });
    });
}
