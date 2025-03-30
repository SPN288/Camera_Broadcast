const express = require("express");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        try {
            const parsed = JSON.parse(message);
            if (parsed.type === "image") {
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(parsed));
                    }
                });
            }
        } catch (err) {
            console.error("Invalid JSON received:", err);
        }
    });

    ws.on("close", () => console.log("Client disconnected"));
});

server.listen(5000, () => console.log("Server running on port 5000"));
