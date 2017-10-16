/**
 * Listen to services and funnel these to a single websocket stream.
 */
/* eslint no-console: 0 */
"use strict";
const ioClient = require("socket.io-client");
const IO = require("socket.io");
const M = require("most");
const RunningBuffer = require("./src/running-buffer/running-buffer");

const config = require("./config.js");

const {
    createServicesConnectionStatus,
    setStatus
} = require("./src/connection-status/connection-status");

//////////////////////////////////////////////////////
// Streams
//

const createServiceSocket$ = ioClient => services =>
    M.from(services).map(({ name, url }) => ({
        name,
        socket: ioClient(url, { forceNew: true })
    }));

const createServiceMessage$ = ({ socket }) => M.fromEvent("message", socket);

const createServiceConnected$ = ({ name, socket }) =>
    M.fromEvent("connect", socket).map(() => ({ [name]: "connected" }));

const createServiceDisconnected$ = ({ name, socket }) =>
    M.fromEvent("disconnect", socket).map(() => ({ [name]: "disconnected" }));

const createConnectionStatus$ = ({ name, socket }) =>
    M.merge(
        createServiceConnected$({ name, socket }),
        createServiceDisconnected$({ name, socket })
    );

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
