/**
 * server.ts
 * 
 * Creates an express HTTP server which hosts
 * WebSocket and GraphQL servers.
 * @author yousef
 */

// Load env variables.
require("dotenv").config();

import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import localtunnel, { Tunnel } from "localtunnel"
import { setupWebSocket } from "./setupWebSocket";
import { gqlServer } from "./graphql";
import { debug, logError } from "./util";
import notificationRoutes from "./notification/notification.route";

// Create the express instance
const app = express();

app.use(express.json());                                // parse application/json
app.use(bodyParser.urlencoded({ extended: false }));    // parse application/x-www-form-urlencoded
app.use(cors());                                        // allow cross-origin

// Link routes
app.use("/notification", notificationRoutes);

const expressPort = Number(process.env.EXPRESS_PORT) || 5000; // Default express server port
const graphQLPort = Number(process.env.GRAPHQL_PORT) || 5001; // Default graphql server port

// Map of subdomains to ports
const tunnelConfig = {
    "floralyfec": expressPort, 
    "floralyfeg": graphQLPort
};

const server = http.createServer(app);

// Define a route handler for the default home page
app.get("/", (req, res) => {
    res.status(200).send("Home route get");
});


// Define a route handler for the default home page
app.get("/test", (req, res) => {
    res.status(200).send("Test passed!");
});

// Start the Express server
server.listen(expressPort, () => {
    debug(`Express server started at http://localhost:${expressPort}`);
});

// Start the GraphQL server
let graphQLServer: http.Server; 
gqlServer()
    .start({
        port: graphQLPort,
        endpoint: "/graphql",
        subscriptions: "/subscriptions",
    })
    .then((server: http.Server) => {
        graphQLServer = server;
        debug(`GraphQL server started at http://localhost:${graphQLPort}`);
    });

// Local Tunnel stopped working for some reason - using ngrok for now

// Setup a tunnel to both server ports so they're remotely accessible
// const tunnels = Object.keys(tunnelConfig).reduce((acc: Tunnel[], subdomain: string, _): Tunnel[] => {
//     const port = tunnelConfig[subdomain];
//     const tunnel = localtunnel(port, { subdomain }, (err, tunnel) => {
//         if (!err) { debug("Started tunnel @", tunnel.url); }
//         else { logError("Tunnel error:", err); }
//     });

//     tunnel.on("close", () => debug("Closed tunnel @", tunnel.url));
//     acc.push(tunnel);
//     return acc;
// }, [] as Tunnel[]);

// Setup and start associated WebSocket on distinct server ws://express
setupWebSocket(server);

// Graceful shutdown
const cleanup = async () => {
    debug("Received termination signal, shutting down.");

    // tunnels.forEach(tunnel => tunnel.close());

    await graphQLServer.close();
    debug("GraphQL Server closed.")


    server.close(() => {
        debug("Core Server closed.\nTerminated gracefully.");
        process.exit(0);
    });

    setTimeout(() => {
        logError("Termination process timed out, forcefully shutting down.");
        process.exit(1);
    }, 10 * 1000);
}

// Cleanup callback on termination
process.on('SIGINT', cleanup);
process.on("SIGTERM", cleanup);

export { server, expressPort, graphQLPort };
