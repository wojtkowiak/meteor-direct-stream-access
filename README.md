## Meteor Direct Stream Access

A really simple API to directly access the SockJS stream in Meteor.

### Main features

- protocol independent, messages are strings so you are not forced to use JSON, you can for example use binary data like BSON or protobuff
- you can prevent Meteor from trying to interpret the messages so the communication goes unnoticed by Meteor (less CPU usage)

### Is this the same as *streamy* or *meteor-streams*?

Not really, the main feature is more or less the same but the implementation and features differs.

Firstly lets talk about the internals:
- *meteor-streams* is using meteor's collection/publish/subscribe mechanisms
- *streamy* is more or less extending the DDP protocol
- this package provides a more bare access to the socket, it does it in the most hacky way by wrapping some internal Meteor code.
The reason to do it in that way was to achieve the features listed above.
 
This package does not provide any allow/deny mechanism nor meteor sessions abstraction or management. For now you have to do it yourself.
However a security add-on is planned.

### Installation

Just add the package to your project with:

`meteor add omega:direct-stream-access`

## Usage

Use `onMessage` to register a callback for processing incoming messages. Use `send` to send messages and on server you can also use `broadcast`. 
In the handler you probably need to distinguish your custom messages from the DDP packets and if you want, you can prevent Meteor from processing your messages by calling `this.preventCallingMeteorHandler()` inside the message handler.

```javascript
// Register a handler to receive messages. It will also receive DDP packets.
Meteor.directStream.onMessage(function messageHandler(message, sessionId) {
    console.log('Got a message: ' + message ' from session id: ' + sessionId;
    if (message === 'test message') this.preventCallingMeteorHandler();
});
if (Meteor.isServer) {
    Meteor.directStream.broadcast('test message');
}
if (Meteor.isClient) {
    Meteor.directStream.send('test message');
}
```

## Client API

[Client API](CLIENT.md)

## Server API

[Server API](SERVER.md)

## Contributing

If you discovered a bug please file an issue. PR are always welcome, but be sure to run and update the tests.

### Tests

To run the tests, being inside the meteor project that uses this package type:

`meteor test-packages --driver-package=practicalmeteor:mocha omega:direct-stream-access`

and check out the results in the browser.

*If you will run the tests in two or more browsers in the same time, the tests may produce false negative output.*
