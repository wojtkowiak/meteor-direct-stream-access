# Meteor Direct Stream Access

A really simple API to directly use the SockJS socket in Meteor.

#### **Check also [meteor-custom-protocol](https://github.com/wojtkowiak/meteor-custom-protocol)!**

### Main features

- protocol independent, messages are strings so you are not forced to use JSON, you can for example use binary data like BSON or protobuff
- you can prevent Meteor from trying to interpret the messages so the communication goes unnoticed by Meteor (efficiency)

### Is this the same as *streamy* or *meteor-streams*?

Not really, the main feature is more or less the same but the implementation and features differs.

Firstly lets talk about the internals:
- *meteor-streams* is using meteor's collection/publish/subscribe mechanisms
- *streamy* is more or less extending the DDP protocol
- this package provides a more bare access to the socket, it does it by wrapping some internal Meteor code.
The reason to do it in that way was to achieve the features listed above.
 
This package does not provide any allow/deny mechanism nor meteor sessions abstraction or management. For now you have to do it yourself.
However a security add-on is planned. Until you want to mess a little with DDP or just send some data this package will be ok, but what you will probably find more useful is [meteor-custom-protocol](https://github.com/wojtkowiak/meteor-custom-protocol).

### Installation

Just add the package to your project with:

`meteor add omega:direct-stream-access`

## Usage

Use `onMessage` to register a callback for processing incoming messages. Use `send` to send messages and on server you can also use `broadcast`. 
In the handler you probably need to distinguish your custom messages from the DDP packets and if you want, you can prevent Meteor from processing your messages by calling `this.preventCallingMeteorHandler()` inside the message handler.

```javascript
// Register a handler to receive messages. It will also receive DDP packets.
Meteor.directStream.onMessage(function messageHandler(message, sessionId, userId) {
    console.log('Got a message: ' + message + ' from session id: ' + sessionId);
    if (message === 'test message') {
        this.preventCallingMeteorHandler();
    }
});
if (Meteor.isServer) {
    Meteor.directStream.broadcast('test message');
}
if (Meteor.isClient) {
    Meteor.directStream.send('test message');
}

// Custom DDP.
const ddp = DDP.connect('ip:port');
const connectionId = Meteor.directStream.registerConnection(ddp);

if (Meteor.isClient) {
    Meteor.directStream.send('test message', ddp);
}

// `connectionId` and `connection` can be used to distinguish messages coming from additional DDP connection.
Meteor.directStream.onMessage(function messageHandler(message, sessionId, userId, connectionId, connection) {
});

```

## Client API

[Client API](CLIENT.md)

## Server API

[Server API](SERVER.md)

## Contributing

If you discovered a bug please file an issue. PR are always welcome, but be sure to run and update the tests.
Please also regenerate the docs running `npm run docs`.

### Tests

To run the tests:

`npm run test`

and check out the results in the browser.

*If you will run the tests in two or more browsers in the same time, tests might produce false negative output.*

### Changelog

- **4.0.3** 
    - added support for Meteor `1.8.1`  

- **4.0.0** 
    - added support for `DDP.connect` and `userId` in the server's message handler
    - dropped support for Meteor below `1.4`  
