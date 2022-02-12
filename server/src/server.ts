import express from "express";
import http from "http";
import { setupWebSocket } from "./setupWebSocket";

const app = express();
const port = process.env.PORT || 4000; // default port to listen

const server = http.createServer(app);

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.status(200).send( "Hello world!");
});

// start the Express server
server.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );

setupWebSocket(server)

export { server };