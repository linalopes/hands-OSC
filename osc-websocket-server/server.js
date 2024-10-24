const osc = require("osc");
const WebSocket = require("ws");




// OSC configuration to send messages to ESP8266
const udpPort = new osc.UDPPort({
    localAddress: "192.168.1.102",    // The local address of the computer (can be 0.0.0.0)
    localPort: 54321,           // OSC port on your computer (can be any)
    remoteAddress: "192.168.1.201", // The IP address of the ESP8266
    remotePort: 54321           // OSC port configured on ESP8266
});


udpPort.on("ready", async function () {
    console.log("UDP port ready");

    await udpPort.send({
        address: "/servo",  // OSC Address (can be whatever you want)
        args: [
            90
        ]
    });
});
udpPort.on("error", function (err) {
    console.log('OSC ERROR', err);
});
udpPort.on("message", function (oscMsg) {
    console.log("OSC Message received: ", oscMsg);
});

udpPort.open();



// Configure WebSocket Server
const wss = new WebSocket.Server({ port: 8081 }); // WebSocket Server running on port 8081

wss.on("connection", function connection(ws) {
    ws.on("message", async function incoming(message) {
        console.log("Received from client: %s", message);


        // Send OSC message to ESP8266
        await udpPort.send({
            address: "/servo",  // OSC Address (can be whatever you want)
            args: [
                parseInt(message)
            ]
        });
    });

    ws.send("WebSocket server ready to send OSC to ESP8266");
});
