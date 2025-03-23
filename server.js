const path = require("path");
const express = require("express");
const WebSocket = require("ws");
const app = express();

// Use Render's environment variable for the port
const PORT = process.env.PORT || 10000; // Use Render's PORT or fallback to 10000

// Create an HTTP server
const server = app.listen(PORT, () =>
  console.log(`HTTP server listening at http://localhost:${PORT}`)
);

// Create a WebSocket server by passing the HTTP server
const wsServer = new WebSocket.Server({ server });

// Array of connected WebSocket clients
let connectedClients = [];

wsServer.on("connection", (ws, req) => {
  console.log("Connected");
  connectedClients.push(ws);

  ws.on("message", (data) => {
    console.log("Received data:", data); // Log received data
    connectedClients.forEach((ws, i) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(data); // Echo the data back
      } else {
        connectedClients.splice(i, 1); // Remove disconnected clients
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    connectedClients = connectedClients.filter(client => client !== ws);
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err); // Log WebSocket errors
  });
});

// HTTP server routes
app.use("/image", express.static("image")); // Serve static images
app.use("/js", express.static("js")); // Serve static JavaScript files
app.get("/audio", (req, res) =>
  res.sendFile(path.resolve(__dirname, "./audio_client.html")) // Serve HTML file
);