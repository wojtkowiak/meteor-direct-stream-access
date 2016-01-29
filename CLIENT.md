<a name="DirectStreamAccess"></a>
### DirectStreamAccess : <code>[DirectStreamAccess](#DirectStreamAccess)</code>
Implementation for the **CLIENT** side. Available as `Meteor.directStream` singleton.

**Kind**: global class  
**Extends:** <code>[DirectStreamAccessCommon](#DirectStreamAccessCommon)</code>  
**Category**: CLIENT  

* [DirectStreamAccess](#DirectStreamAccess) : <code>[DirectStreamAccess](#DirectStreamAccess)</code>
  * _instance_
    * [.send(message)](#DirectStreamAccess+send)
    * [.registerMessageHandler(messageHandler)](#DirectStreamAccessCommon+registerMessageHandler)
    * [.preventCallingMeteorHandler()](#DirectStreamAccessCommon+preventCallingMeteorHandler)
    * [.stopProcessingHandlers()](#DirectStreamAccessCommon+stopProcessingHandlers)
    * [._processMessage(message, sessionId)](#DirectStreamAccessCommon+_processMessage)
  * _inner_
    * [~messageHandler](#DirectStreamAccess..messageHandler) : <code>function</code>

<a name="DirectStreamAccess+send"></a>
#### meteor.directStream.send(message)
Sends a message to the server.This method does not throw any error if there is no connection to server. If you care about this check the statuswith Meteor.status() before sending anything.

**Kind**: instance method of <code>[DirectStreamAccess](#DirectStreamAccess)</code>  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Message to send to the server. |

<a name="DirectStreamAccessCommon+registerMessageHandler"></a>
#### meteor.directStream.registerMessageHandler(messageHandler)
Registers a message handler, which will be called to process every incoming message on the socket.

**Kind**: instance method of <code>[DirectStreamAccess](#DirectStreamAccess)</code>  

| Param | Type | Description |
| --- | --- | --- |
| messageHandler | <code>[messageHandler](#DirectStreamAccess..messageHandler)</code> | Function to process the incoming messages. |

<a name="DirectStreamAccessCommon+preventCallingMeteorHandler"></a>
#### meteor.directStream.preventCallingMeteorHandler()
Prevents calling the original meteor message handler. Makes the message invisible for Meteor.Since any message handler is bound to this class, inside the message handler it is just called with `this.preventCallingMeteorHandler()`.

**Kind**: instance method of <code>[DirectStreamAccess](#DirectStreamAccess)</code>  
<a name="DirectStreamAccessCommon+stopProcessingHandlers"></a>
#### meteor.directStream.stopProcessingHandlers()
Stops processing any other message handlers.Since any message handler is bound to this class, inside the message handler it is just called with `this.stopProcessingHandlers()`.

**Kind**: instance method of <code>[DirectStreamAccess](#DirectStreamAccess)</code>  
<a name="DirectStreamAccessCommon+_processMessage"></a>
#### meteor.directStream._processMessage(message, sessionId)
Passes the received message to registered handlers.

**Kind**: instance method of <code>[DirectStreamAccess](#DirectStreamAccess)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Raw message received on the socket. |
| sessionId | <code>string</code> | Meteor's internal session id. |

<a name="DirectStreamAccess..messageHandler"></a>
#### Meteor.directStream~messageHandler : <code>function</code>
Callback passed to the `registerMessageHandler` that should process the incoming messages.

**Kind**: inner typedef of <code>[DirectStreamAccess](#DirectStreamAccess)</code>  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | Message received on the socket. |
| [sessionId] | <code>string</code> | Meteor's internal session id. |

