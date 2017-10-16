/**
 * Listen to services and funnel these to a single websocket stream.
 */
/* eslint no-console: 0 */
"use strict";
const ioClient = require("socket.io-client");
const IO = require("socket.io");
const RunningBuffer = require("./src/running-buffer/running-buffer");

const config = require("./config.js");

const {
    createServiceSocket$,
    createServiceMessage$,
    createConnectionStatus$
} = require("./src/streams/streams");

const {
    createServicesConnectionStatus,
    setStatus
} = require("./src/connection-status/connection-status");

//////////////////////////////////////////////////////
// Run stuff
//
process.title = config.processTitle;

const ioServer = new IO(config.port);
const messageBuffer = new RunningBuffer(13);

const serviceConnectionStatus = createServicesConnectionStatus(config.services);

const listeningSocket$ = createServiceSocket$(ioClient)(config.services);

// Message funneling
const message$ = listeningSocket$.multicast().chain(createServiceMessage$);

message$
    .tap(message => messageBuffer.add(message))
    .observe(message => ioServer.emit("message", message))
    .catch(console.error);

// Status stream
const connectionStatus$ = listeningSocket$
    .chain(createConnectionStatus$)
    .tap(({ name, status }) => setStatus(name)(status)(serviceConnectionStatus));

connectionStatus$
    .observe(status => ioServer.emit("connectionStatusChange", status))
    .catch(console.error);

// Request status
ioServer.on("requestConnectionStatus", socket => {
    socket.emit("currentConnectionStatus", serviceConnectionStatus);
});

// Send buffered messages on connection
ioServer.on("connect", socket => {
    console.log("incoming connection");
    messageBuffer.buffer.forEach(message => {
        socket.emit("message", message);
    });
});

console.log("funneling: ", config.services, "\non port: ", config.port);
