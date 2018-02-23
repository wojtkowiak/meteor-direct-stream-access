<a name="DirectStreamAccess"></a>

### DirectStreamAccess : <code>[DirectStreamAccess](#DirectStreamAccess)</code>
Implementation for the **SERVER** side. Available as `Meteor.directStream` singleton.

**Kind**: global class  
**Extends:** <code>[DirectStreamAccessCommon](#DirectStreamAccessCommon)</code>  
**Category**: SERVER  

* [DirectStreamAccess](#DirectStreamAccess) : <code>[DirectStreamAccess](#DirectStreamAccess)</code>
    * _instance_
        * [.send(message, sessionId)](#DirectStreamAccess+send)
        * [.broadcast(message)](#DirectStreamAccess+broadcast)
        * [.onMessage(messageHandler)](#DirectStreamAccessCommon+onMessage)
        * [.preventCallingMeteorHandler()](#DirectStreamAccessCommon+preventCallingMeteorHandler)
        * [.stopProcessingHandlers()](#DirectStreamAccessCommon+stopProcessingHandlers)
        * [._processMessage(message, [sessionId], [userId], [connectionId], [connection])](#DirectStreamAccessCommon+_processMessage)
    * _inner_
        * [~messageHandler](#DirectStreamAccess..messageHandler) : <code>function</code>

<a name="DirectStreamAccess+send"></a>

#### meteor.directStream.send(message, sessionId)
Sends a message to a specified Meteor session id.

**Kind**: instance method of <code>[DirectStreamAccess](#DirectStreamAccess)</code>  
**Throws**:

- <code>Error</code> When session id is not found.


| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Message to send to the client. |
| sessionId | <code>string</code> | Meteor's internal session id. |

<a name="DirectStreamAccess+broadcast"></a>

#### meteor.directStream.broadcast(message)
Broadcasts the message to all clients.

**Kind**: instance method of <code>[DirectStreamAccess](#DirectStreamAccess)</code>  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Message to send to all connected clients. |

<a name="DirectStreamAccessCommon+onMessage"></a>

#### meteor.directStream.onMessage(messageHandler)
Registers a message handler, which will be called to process every incoming message
on the socket.

**Kind**: instance method of <code>[DirectStreamAccess](#DirectStreamAccess)</code>  

| Param | Type | Description |
| --- | --- | --- |
| messageHandler | <code>[messageHandler](#DirectStreamAccess..messageHandler)</code> | Function to process the      incoming messages. |

<a name="DirectStreamAccessCommon+preventCallingMeteorHandler"></a>

#### meteor.directStream.preventCallingMeteorHandler()
Prevents calling the original meteor message handler. Makes the message invisible for Meteor.
Since any message handler is bound to this class, inside the message handler it is just
called with `this.preventCallingMeteorHandler()`.

**Kind**: instance method of <code>[DirectStreamAccess](#DirectStreamAccess)</code>  
<a name="DirectStreamAccessCommon+stopProcessingHandlers"></a>

#### meteor.directStream.stopProcessingHandlers()
Stops processing any other message handlers.
Since any message handler is bound to this class, inside the message handler it is just
called with `this.stopProcessingHandlers()`.

**Kind**: instance method of <code>[DirectStreamAccess](#DirectStreamAccess)</code>  
<a name="DirectStreamAccessCommon+_processMessage"></a>

#### meteor.directStream._processMessage(message, [sessionId], [userId], [connectionId], [connection])
Passes the received message to registered handlers.

**Kind**: instance method of <code>[DirectStreamAccess](#DirectStreamAccess)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Raw message received on the socket. |
| [sessionId] | <code>string</code> | Meteor's internal session id. |
| [userId] | <code>string</code> | User id if available. |
| [connectionId] | <code>Symbol</code> | Id of the additional DDP connection. |
| [connection] | <code>Object</code> | Reference to DDP connection object. |

<a name="DirectStreamAccess..messageHandler"></a>

#### Meteor.directStream~messageHandler : <code>function</code>
Callback passed to the `registerMessageHandler` that should process the incoming messages.

**Kind**: inner typedef of <code>[DirectStreamAccess](#DirectStreamAccess)</code>  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Message received on the socket. |
| [sessionId] | <code>string</code> | Meteor's internal session id. |
| [userId] | <code>string</code> | User id if available. |
| [connectionId] | <code>Symbol</code> | Id of the additional DDP connection. |
| [connection] | <code>Object</code> | Reference to DDP connection object. |

