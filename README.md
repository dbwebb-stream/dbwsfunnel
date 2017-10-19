# dbwebb-stream funnel

En websocket server som lyssnar efter meddelanden från dbwebb-stream tjänster och pressenterar dessa som en enda meddelandeström över websocket.

## Installation
1. Klona repot.
2. `cd` in och kör `$ npm install`

## Konfigurera
I rotkatalogen finns filen `config.js` där du kan sätta vilka tjänster funnel ska lyssna på.

Ex:
```js
module.exports = {
    processTitle: "dbsfunnel", // if you change processTitle you need to do additional changes
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
```

Namnet på tjänsten kan vara vad som helst men bör vara beskrivande då detta namn används för att lagra och kommunisera subtjänsternas status.

## Starta
`$ npm start`.

Startar på port angiven i miljövariabeln `PORT` eller på 1339.

## Stoppa
`$ npm stop`

License
------------------

This software carries a MIT license.



```
 .
..:  @ 2017 Anders Nygren (litemerafrukt@gmail.com)
```
