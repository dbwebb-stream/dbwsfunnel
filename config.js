/**
 * Config
 */
module.exports = {
    processTitle: "dbsfunnel",
    port: process.env.DBSFUNNEL || 64001,
    services: [
        {
            name: "irc",
            url: "http://litemerafrukt.se:1337"
        },
        {
            name: "gitter",
            url: "http://localhost:1338"
        }
    ]
};
