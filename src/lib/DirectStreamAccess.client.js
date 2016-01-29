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
    }

    /**
     * Sends a message to the server.
     * This method does not throw any error if there is no connection to server. If you care about this check the status
     * with Meteor.status() before sending anything.
     *
     * @param {string} message Message to send to the server.
     */
    send(message) {
        Meteor.connection._stream.send(message);
    }

    /**
     * Returns true if the hook for catching incoming data is installed.
     *
     * @private
     * @returns {boolean}
     */
    _isInstalled() {
        return (DDPCommon._parseDDP) ? true : false;
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
                    // We do not want Meteor to complain about invalid JSON or DDP so we are faking a `pong` message.
                    return { msg: 'pong' };
                }
                return DDPCommon._parseDDP(message);
            };
        }
    }
};
