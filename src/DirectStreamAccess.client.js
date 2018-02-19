/**
 * Implementation for the **CLIENT** side. Available as `Meteor.directStream` singleton.
 *
 * @typicalname Meteor.directStream
 * @extends DirectStreamAccessCommon
 * @category CLIENT
 * @type {DirectStreamAccess}
 */
DirectStreamAccess = class DirectStreamAccess extends DirectStreamAccessCommon {

    constructor() {
        super();
        this._connections = new WeakMap();
    }

    /**
     * Sends a message to the server.
     * This method does not throw any error if there is no connection to server. If you care about
     * this check the status with Meteor.status() before sending anything.
     * You can pass an additional custom DDP connection in order to use that one instead the default one.
     *
     * @param {string} message           - Message to send to the server.
     * @param {Object} connection        - DDP connection instance or connection id.
     */
    send(message, connection) {
        let ddpConnection;
        if (connection === undefined) {
            ddpConnection = Meteor.connection;
        } else {
            ddpConnection = connection;
        }
        ddpConnection._stream.send(message);
    }

    /**
     * Register a custom connection from `DDP.connect`.
     *
     * @param {Object=} connection   - Reference to DDP connection object.
     *
     * @returns {Symbol} Id of the additional DDP connection.
     */
    registerConnection(connection) {
        const self = this;
        if (!this._connections.has(connection)) {
            const callbacks = connection._stream.eventCallbacks.message;
            const connectionId = Symbol();
            let installed = false;
            callbacks.forEach(
                (callback, id) => {
                    if (callback.name === 'bound onMessage' && !installed) {
                        connection._stream.eventCallbacks.message[id] = function directStreamOnMessage(rawMsg){
                            self._processMessage(rawMsg, undefined, undefined, connectionId, connection);

                            if (self._preventMeteor) {
                                self._preventMeteor = false;
                                // We do not want Meteor to complain about invalid JSON or DDP so we
                                // are faking a `pong` message.
                                return '{"msg":"pong"}';
                            }
                            return callback(rawMsg);
                        };
                        installed = true;
                        this._connections.set(connection, connectionId);
                    }
                }
            );
            if (installed) {
                connection.___directStreamInstalled = true;
                return connectionId;
            } else {
                throw new Error('Could not attach to DDP connection.22');
            }
        }
        return this._connections.get(connection);
    }

    /**
     * Returns true if the hook for catching incoming data is installed.
     *
     * @private
     * @returns {boolean}
     */
    _isInstalled() {
        return !!DDPCommon._parseDDP;
    }

    /**
     * Installs the hook for capturing incoming data.
     *
     * @private
     */
    _install() {
        const self = this;

        if (!this._isInstalled()) {
            DDPCommon._parseDDP = DDPCommon.parseDDP;
            DDPCommon.parseDDP = function parseDDP(message) {
                self._processMessage(message);

                if (self._preventMeteor) {
                    self._preventMeteor = false;
                    // We do not want Meteor to complain about invalid JSON or DDP so we
                    // are faking a `pong` message.
                    return { msg: 'pong' };
                }
                return DDPCommon._parseDDP(message);
            };
        }
    }
};
