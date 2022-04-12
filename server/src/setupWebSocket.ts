/**
 * setupWebSockets.ts
 * 
 * Sets up and attaches a WebSocket
 * to a specified express server.
 * @author yousef
 */
// TODO: consider WebSocket.createWebsocketStream with picam capture()

import http from "http";
import WebSocket from "ws";
import { debug, deepLog } from "./util";

// WebSocket response status'
const enum status {
    SUCCESS = 200,
    ERROR = 400,
}

// WebSocket received data structure
interface WSData {
    topic: string; // The topic being sent
    // Sender id
    deviceID?: string; // One of two ids, either deviceID (from pi session)
    userID?: string; // or userID (from web client session)
    payload: any; // The associated data being sent
}

// WebSocket response data structure
interface WSResponse {
    status: number; // The status
    message?: string; // A success message
    error?: {
        // A error message
        message: string;
    };
}

// ClientMap interface. Stores a collection
// of WebSockets subscribed to a particular sender id (device or user).
interface ClientMap {
    [id: string]: Set<WebSocket>;
}

/**
 * Wraps the specified message into an error response.
 * @param message string, the message to wrap.
 * @returns WSResponse, the websocket error response.
 */
const errorResponse = (message: string): WSResponse => ({
    status: status.ERROR,
    error: {
        message,
    },
});

/**
 * Wraps the specified message into a success response.
 * @param message string, the message to wrap.
 * @returns WSResponse, the websocket success response.
 */
const successResponse = (message: string): WSResponse => ({
    status: status.SUCCESS,
    message,
});

// The client map. Stores socket client subscriptions to senders.
export const clients: ClientMap = {};

/**
 * Creates a subscription from the clientSocket
 * to the specified subscriptionID.
 *
 * @param subscriptionID string, the sender to subscribe to (either user or device).
 * @param clientSocket WebSocket, the websocket to subscribe.
 * @returns WSResponse, the WebSocket response.
 */
export const addSubscription = (
    subscriptionID: string,
    clientSocket: WebSocket
): WSResponse => {
    if (clients[subscriptionID] === undefined) {
        // This is the first subscription for subscriptionID, create a new set.
        clients[subscriptionID] = new Set();
    } else if (clients[subscriptionID].has(clientSocket)) {
        // Notify the client they're already subscribed.
        return errorResponse(`Already suscribed to ${subscriptionID}`);
    }

    // Create the subscription
    clients[subscriptionID].add(clientSocket);
    return successResponse(`Successfully subscribed to ${subscriptionID}`);
};

/**
 * Removes a subscription from the clientSocket
 * to the specified subscriptionID.
 *
 * @param subscriptionID string, the sender to unsubscribe from (either user or device).
 * @param clientSocket WebSocket, the socket to unsubscribe.
 * @returns WSResponse, the WebSocket response.
 */
const removeSubscription = (
    subscriptionID: string,
    clientSocket: WebSocket
): WSResponse => {
    if (clients[subscriptionID] === undefined) {
        // No subscriptions exist for this id.
        return errorResponse(
            `Could not find sender with id: ${subscriptionID}`
        );
    } else if (!clients[subscriptionID].delete(clientSocket)) {
        // The specified client is not subscribed to the id.
        return errorResponse(`No subscription exists to id: ${subscriptionID}`);
    }

    // Successfully unsubscribed.
    return successResponse(`Successfully unsubscribed from ${subscriptionID}`);
};

/**
 * Processes a message from the specified
 * Websocket .
 * @param ctx WebSocket, the sender client.
 * @param message WebSocket.RawData, the message sent.
 */
export const processMessage = (ctx: WebSocket, message: WebSocket.RawData): void => {
    let data: WSData;

    // Attempt to decode binary data to json. All message must be in JSON format.
    try {
        data = JSON.parse(Buffer.from(message as ArrayBuffer).toString());
        deepLog(data);
    } catch (e) {
        const response = {
            status: status.ERROR,
            error: { message: "Invalid JSON." },
        };
        ctx.send(JSON.stringify(response));
        return;
    }

    // deepLog(data)

    // Assert topic field
    if (data.topic === undefined) {
        const response = {
            status: status.ERROR,
            error: { message: "Invalid topic." },
        };
        ctx.send(JSON.stringify(response));
        return;
    }

    const { topic, payload, userID, deviceID } = data;

    if (data.topic === "ping") {
        ctx.send("heartbeat");
        // deepLog("heartbeat")
        return;
    }
    
    // Process the remaining payload based on topic. Subscription id in payload.
    switch (topic) {
        // Create a subscription between id and socket ctx.
        case "subscribe": {
            const id =
                payload.userID !== undefined
                    ? payload.userID
                    : payload.deviceID;

            // Assert an id to subscribe to
            if (id === undefined) {
                const response = {
                    status: status.ERROR,
                    error: { message: "Invalid id." },
                };
                ctx.send(JSON.stringify(response));
                return;
            }

            ctx.send(JSON.stringify(addSubscription(id, ctx)));
            return;
        }

        // Remove subscription between id and socket ctx. Subscription id in payload.
        case "unsubscribe": {
            const id =
                payload.userID !== undefined
                    ? payload.userID
                    : payload.deviceID;

            // Assert an id to unsubscribe from
            if (id === undefined) {
                const response = {
                    status: status.ERROR,
                    error: { message: "Invalid id." },
                };

                ctx.send(JSON.stringify(response));
                return;
            }

            ctx.send(JSON.stringify(removeSubscription(id, ctx)));
            return;
        }

        // All other topics are processed by
        // broadcasting the received payload to all clients
        // subscribed to the sender
        default: {
            // Construct message consisting of payload and topic
            const msg = { topic, payload };

            // Acquire the sender's id
            const id = userID !== undefined ? userID : deviceID;

            if (id === undefined) {
                const response = {
                    status: status.ERROR,
                    error: { message: "Invalid id." },
                };
                ctx.send(JSON.stringify(response));
                return;
            }

            // No one is listening to this message
            if (!clients[id]) return;

            // Broadcast the message to all subscribed clients
            clients[id].forEach((client) => {
                if (client !== ctx) client.send(JSON.stringify(msg));
            });
            return;
        }
    }
};

/**
 * Creates and a WebSocket on a seperate server
 * but binds connection requests to the specified express server
 * to be upgraded.
 * @param server http.Server, the express server to bind to.
 */
const setupWebSocket = (server: http.Server): void => {
    debug("Creating websocket");
    const wss = new WebSocket.Server({ noServer: true });

    // Handle upgrade of the request (from http server -> ws)
    server.on("upgrade", function upgrade(request, socket, head) {
        debug("Got connection request")
        try {
            // Authentication and some other steps will come here
            // we can choose whether to upgrade or not

            // Upgrade
            wss.handleUpgrade(request, socket, head, function done(ws) {
                wss.emit("connection", ws, request);
            });
        } catch (err) {
            debug("upgrade exception", err);
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }
    });

    // After a successful connection
    // Register event callbacks and emit a success message.
    wss.on("connection", (ctx) => {
        debug("connected", wss.clients.size);

        // Handle message receive event
        ctx.on("message", (message) => processMessage(ctx, message));

        // Handle close event
        ctx.on("close", () => debug("closed", wss.clients.size));

        // Send a message that we're good to proceed
        ctx.send("Connection established.");
    });
};

export { setupWebSocket };
