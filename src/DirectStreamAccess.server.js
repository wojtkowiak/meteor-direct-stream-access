/**
 * Implementation for the **SERVER** side. Available as `Meteor.directStream` singleton.
 *
 * @typicalname Meteor.directStream
 * @extends DirectStreamAccessCommon
 * @category SERVER
 * @type {DirectStreamAccess}
 */
DirectStreamAccess = class DirectStreamAccess extends DirectStreamAccessCommon {
    /**
     * Returns true if hook for catching incoming data is installed.
     *
     * @returns {boolean}
     * @private
     */
    _isInstalled() {
        return this._registeredInStreamServer;
    }

    /**
     * Installs the hook for capturing incoming data. On the server we are wrapping the default
     * callback for `data` event on every socket.
     *
     * @private
     */
    _install() {
        const self = this;

        if (!this._isInstalled()) {
            Meteor.server.stream_server.register(function directStreamAccessSocketHandler(socket) {
                const wrappedCallback = socket._events.data.bind(socket);

                socket._events.data = (message) => {
                    self._processMessage(
                        message,
                        (socket._meteorSession) ? socket._meteorSession.id : null,
                        (socket._meteorSession) ? socket._meteorSession.userId : null
                    );

                    if (!self._preventMeteor) {
                        wrappedCallback(message);
                    } else {
                        self._preventMeteor = false;
                    }
                };
            });
            this._registeredInStreamServer = true;
        }
    }

    /**
     * Sends a message to a specified Meteor session id.
     *
     * @throws {Error} When session id is not found.
     * @param {string} message   - Message to send to the client.
     * @param {string} sessionId - Meteor's internal session id.
     */
    send(message, sessionId) {
        if (Meteor.server.sessions[sessionId]) {
            Meteor.server.sessions[sessionId].socket.send(message);
        } else {
            throw new Error('Meteor session id not found.');
        }
    }

    /**
     * Broadcasts the message to all clients.
     *
     * @param {string} message - Message to send to all connected clients.
     */
    broadcast(message) {
        _.each(Meteor.server.sessions, session => session.socket.send(message));
    }
};
