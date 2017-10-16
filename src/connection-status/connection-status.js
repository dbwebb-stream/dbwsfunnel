/**
 * Connection status
 */
const R = require("ramda");

/**
 * Create service connection status object
 *
 * @sig createServicesConnectionStatus :: [{ name }] -> {{ name, status }, { name, status }, ...}
 */
const createServicesConnectionStatus = R.reduce(
    (servicesConnectStatusObj, { name }) => R.assoc(name, "disconnected", servicesConnectStatusObj),
    {}
);

/**
 * Set status in connectionStatus object
 *
 * @sig setConnected :: k -> a -> { k: b } -> { k: a }
 */
const setStatus = service => status => R.assoc(service, status);

/**
 * Set connected in connectionStatus object
 *
 * @sig setConnected :: k -> { k: v } -> { k: vc }
 */
const setConnected = service => setStatus(service)("connected");

/**
 * Set disconnected in connectionStatus object
 *
 * @sig setConnected :: k -> { k: v } -> { k: vd }
 */
const setDisconnected = service => setStatus(service)("disconnected");

module.exports = {
    createServicesConnectionStatus,
    setConnected,
    setDisconnected,
    setStatus
};
