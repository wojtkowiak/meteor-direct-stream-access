/**
 * Stores common methods that can be used on both server and client.
 * Available in the meteor namespace as a singleton: `Meteor.directStream`.
 *
 * @abstract
 * @typicalname Meteor.directStream
 * @type {DirectStreamAccessCommon}
 */
DirectStreamAccessCommon = class DirectStreamAccessCommon {
    /**
     * Adds a call to `this._install` to the Meteor.startup.
     * This class should be considered abstract.
     */
    constructor() {
        if (this._install === undefined || typeof this._install !== 'function') {
            throw new TypeError('Tried to construct an abstract class.');
        }

        Meteor.startup(() => {
            this._install();
        });

        this._registeredInStreamServer = false;
        this._messageHandlers = [];

        this._preventMeteor = false;
        this._stopProcessing = false;
    }

    /**
     * Registers a message handler, which will be called to process every incoming message
     * on the socket.
     *
     * @param {DirectStreamAccess~messageHandler} messageHandler - Function to process the
     *      incoming messages.
     */
    onMessage(messageHandler) {
        this._messageHandlers.push(messageHandler.bind(this));
    }

    /**
     * Prevents calling the original meteor message handler. Makes the message invisible for Meteor.
     * Since any message handler is bound to this class, inside the message handler it is just
     * called with `this.preventCallingMeteorHandler()`.
     */
    preventCallingMeteorHandler() {
        this._preventMeteor = true;
    }

    /**
     * Stops processing any other message handlers.
     * Since any message handler is bound to this class, inside the message handler it is just
     * called with `this.stopProcessingHandlers()`.
     */
    stopProcessingHandlers() {
        this._stopProcessing = true;
    }

    /**
     * Passes the received message to registered handlers.
     *
     * @param {string} message       - Raw message received on the socket.
     * @param {string=} sessionId    - Meteor's internal session id.
     * @param {string=} userId       - User id if available.
     * @param {Symbol=} connectionId - Id of the additional DDP connection.
     * @param {Object=} connection   - Reference to DDP connection object.
     *
     * @protected
     */
    _processMessage(message, sessionId, userId, connectionId, connection) {
        for (const callback of this._messageHandlers) {
            callback(message, sessionId, userId, connectionId, connection);
            if (this._stopProcessing) {
                this._stopProcessing = false;
                break;
            }
        }
    }
};

/**
 * Callback passed to the `registerMessageHandler` that should process the incoming messages.
 * @callback DirectStreamAccess~messageHandler
 * @param {string}  message      - Message received on the socket.
 * @param {string=} sessionId    - Meteor's internal session id.
 * @param {string=} userId       - User id if available.
 * @param {Symbol=} connectionId - Id of the additional DDP connection.
 * @param {Object=} connection   - Reference to DDP connection object.
 *
 */
