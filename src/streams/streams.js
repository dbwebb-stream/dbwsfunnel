/**
 * Streams
 */
"use strict";
const M = require("most");

/**
 * Create a stream of websocket clients.
 *
 * @sig createServiceSocket$ :: ioClient -> services -> Stream
 *  ioClient = Socket IO Client
 *  services = array of services { name: service-name, url: service-url }
 *  Stream   = a stream of { name: service-name, socket: socket-io-client-socket }
 */
const createServiceSocket$ = ioClient => services =>
    M.from(services).map(({ name, url }) => ({
        name,
        socket: ioClient(url, { forceNew: true })
    }));

/**
 * Create a message stream.
 *
 * @sig createServiceMessage$ :: { socket } -> Stream
 *  socket = a stream io socket
 *  Stream = a stream from socket on event "message"
 */
const createServiceMessage$ = ({ socket }) => M.fromEvent("message", socket);

/**
 * Create a stream from "connect" messages on a socket.
 *
 * @sig createServiceConnected$ :: { name, socket } -> Stream({ name: "connected" })
 */
const createServiceConnected$ = ({ name, socket }) =>
    M.fromEvent("connect", socket).map(() => ({ [name]: "connected" }));

/**
 * Create a stream from "disconnect" messages on a socket.
 *
 * @sig createServiceConnected$ :: { name, socket } -> Stream({ name: "disconnected" })
 */
const createServiceDisconnected$ = ({ name, socket }) =>
    M.fromEvent("disconnect", socket).map(() => ({ [name]: "disconnected" }));

/**
 * Create a connection status stream.
 *
 * @sig createConnectionStatus$ :: {name, socket} -> Stream({ name: "connected" | "disconnected" })
 */
const createConnectionStatus$ = ({ name, socket }) =>
    M.merge(
        createServiceConnected$({ name, socket }),
        createServiceDisconnected$({ name, socket })
    );

module.exports = { createServiceSocket$, createServiceMessage$, createConnectionStatus$ };
