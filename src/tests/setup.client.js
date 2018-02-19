Meteor.directStream.onMessage(function testMessageHandler(message) {
    if (message === 'yyyy') {
        Meteor.loginWithPassword('test', 'test', () => {
            Meteor.directStream.send('testUserId');
        });
        this.preventCallingMeteorHandler();
        this.stopProcessingHandlers();
    }
});
