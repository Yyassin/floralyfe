/**
 * Creates an express HTTP server and
 * WebSocket.
 * @author yousef
 */

require("dotenv").config();

import express from "express";
import http from "http";
import { setupWebSocket } from "./setupWebSocket";

const app = express();
const port = process.env.PORT || 4000; // Default port to listen

const server = http.createServer(app);

// Define a route handler for the default home page
app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
});

// Start the Express server
server.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
    console.log(process.env.DEVELOPMENT);
});

// Setup and start associated WebSocket on distinct server ws://
setupWebSocket(server);

export { server };
