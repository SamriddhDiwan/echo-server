const path = require("path");
const express = require("express");
const WebSocket = require("ws");
const app = express();

// Use Render's environment variables for ports
const WS_PORT = process.env.WS_PORT || 8080; // WebSocket port
const HTTP_PORT = process.env.PORT || 8000; // HTTP port (Render uses PORT)

// WebSocket server
const wsServer = new WebSocket.Server({ port: WS_PORT }, () =>
  console.log(`WS server is listening at ws://localhost:${WS_PORT}`)
);

// Array of connected WebSocket clients
let connectedClients = [];

wsServer.on("connection", (ws, req) => {
  console.log("Connected");
  // Add new connected client
  connectedClients.push(ws);
  // Listen for messages from the streamer
  ws.on("message", (data) => {
    connectedClients.forEach((ws, i) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(data); // Send data to all connected clients
      } else {
        connectedClients.splice(i, 1); // Remove disconnected clients
      }
    });
  });
});

// HTTP server
app.use("/image", express.static("image")); // Serve static images
app.use("/js", express.static("js")); // Serve static JavaScript files
app.get("/audio", (req, res) =>
  res.sendFile(path.resolve(__dirname, "./audio_client.html")) // Serve HTML file
);

app.listen(HTTP_PORT, () =>
  console.log(`HTTP server listening at http://localhost:${HTTP_PORT}`)
);