/** Test connection-status module */
/* global test, expect */
const {
    createServicesConnectionStatus,
    setConnected,
    setDisconnected,
    setStatus
} = require("./connection-status");

const services = [
    {
        name: "irc",
        url: "http://litemerafrukt.se:1337"
    },
    {
        name: "gitter",
        url: "http://localhost:1338"
    }
];

const statusObject = {
    irc: "disconnected",
    gitter: "disconnected"
};

const connectedStatusObject = {
    irc: "connected",
    gitter: "connected"
};

test("should create a connection status object", () => {
    expect(createServicesConnectionStatus(services)).toEqual(statusObject);
});

test("should update irc to connected", () => {
    expect(setConnected("irc")(statusObject)).toEqual({
        irc: "connected",
        gitter: "disconnected"
    });
});

test("should update gitter to disconnected", () => {
    expect(setDisconnected("gitter")(connectedStatusObject)).toEqual({
        irc: "connected",
        gitter: "disconnected"
    });
});

test("should update gitter to disconnected by setStatus", () => {
    expect(setStatus("gitter")("disconnected")(connectedStatusObject)).toEqual({
        irc: "connected",
        gitter: "disconnected"
    });
});
