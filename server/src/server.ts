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
import { User } from "../firebaseConfig";
import { gqlServer } from "./graphql";

const app = express();

app.use(express.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(cors());
//app.use("/graphql", gqlServer().requestListener);

const port = process.env.PORT || 4000; // Default port to listen
const server = http.createServer(app);

// Define a route handler for the default home page
app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
});

app.get("/users", async (req, res) => {
    const snapshot = await User.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(list);
});

app.post("/create", async (req, res) => {
    const data = req.body;
    // console.log(data)
    await User.add(data);

    res.status(200).send({
        msg: "User added.",
    });
});

// Start the Express server
server.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
    // console.log(`graphql ready at http:localhost:${port}${graphqlServer.options.getEndpoint}`);
    // console.log("TEST:", process.env.TEST);
});
gqlServer().start({ 
    port: 4001,
    endpoint: "/graphql",
    subscriptions: "/subscriptions"
});

// Setup and start associated WebSocket on distinct server ws://
setupWebSocket(server);

export { server, port };
