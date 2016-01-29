const expect = chai.expect;

if (Meteor.isServer) {
    Meteor.methods({
        dummyMethod: () => true,
        sendMessageFromServerToClient: function sendMessageFromServerToClient(message) {
            Meteor.directStream.send(message, this.connection.id);
            return true;
        }
    });
}

describe('DirectStreamAccess', () => {
    describe('#_install()', () => {
        it('should report proper installation state', () => {
            expect(Meteor.directStream).not.to.be.undefined();
            expect(Meteor.directStream).to.be.instanceof(DirectStreamAccess);
            expect(Meteor.directStream._isInstalled()).to.be.true();
        });
    });

    describe('#send', () => {
        let testDone;
        let messageReceived = false;

        before(() => {
            Meteor.directStream.registerMessageHandler(function messageHandler(message) {
                console.log('messageHandler: ' + message);
                if (message === 'testMessage') {
                    messageReceived = true;
                    this.preventCallingMeteorHandler();
                    // If we received a message from the client on the server then the test is passed.
                    if (Meteor.isServer) {
                        testDone();
                    }
                }
            });
        });

        it('should exchange messages between server and client', (done) => {
            console.log('here');//, Meteor.directStream._messageHandlers.map((el) => el.name));
            testDone = done;
            if (Meteor.isClient) {
                // Send the message to the server so the server side test can finish.
                Meteor.directStream.send('testMessage');

                // Make the server send some message to us.
                Meteor.call('sendMessageFromServerToClient', 'testMessage', () => {
                    // At this point we should have already received the message from server.
                    expect(messageReceived).to.be.true();
                    testDone();
                });
            }
        });

        after(() => {
            // Clear the handlers.
            Meteor.directStream._messageHandlers = [];
        });
    });
});
