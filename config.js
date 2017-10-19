/**
 * Config
 */
module.exports = {
    processTitle: "dbsfunnel",
    port: process.env.PORT || 1339,
    services: [
        {
            name: "irc",
            url: "http://localhost:1337"
        },
        {
            name: "gitter",
            url: "http://localhost:1338"
        }
    ]
};
