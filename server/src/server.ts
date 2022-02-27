/**
 * Creates an express HTTP server and
 * WebSocket.
 * @author yousef
 */

require("dotenv").config();

import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import { setupWebSocket } from "./setupWebSocket";
import { gqlServer } from "./graphql";
import { debug } from "./util";

// Create the express instance
const app = express();

app.use(express.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(cors()); // allow cross-origin

const expressPort = process.env.EXPRESS_PORT || 5000; // Default express server port
const graphQLPort = process.env.GRAPHQL_PORT || 5001; // Default graphql server port
const server = http.createServer(app);

// Define a route handler for the default home page
app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
});

// Start the Express server
server.listen(expressPort, () => {
    debug(`Express server started at http://localhost:${expressPort}`);
});

// Start the GraphQL server
gqlServer()
    .start({
        port: graphQLPort,
        endpoint: "/graphql",
        subscriptions: "/subscriptions",
    })
    .then(() => {
        debug(`GraphQL server started at http://localhost:${graphQLPort}`);
    });

// Setup and start associated WebSocket on distinct server ws://express
setupWebSocket(server);

export { server, expressPort, graphQLPort };
