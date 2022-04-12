/**
 * webSocketClient.test.ts
 * 
 * Tests proper WebSocket Client logic
 * in processing messages, namely subscriptions.
 * @author Yousef
 */

import "mocha";
import { expect } from "chai";
import { graphQLPort } from "../src/server";
import superwstest from "superwstest";
import { before } from "mocha";
import { User } from "../src/models";
import { debug, deepLog } from "../src/util";
import { addSubscription, clients, processMessage } from "../src/setupWebSocket";

// WebSocket connection stub
class SocketStub {
    #data: any[]            // Stores messages received.

    /**
     * Creates a new Socket instance.
     */
    constructor() {
        this.#data = [];
    }

    /**
     * Sends data to this socket stub.
     * @param data, the data being sent.
     */
    send(data: any) {
        this.#data.push(data);
    }

    /**
     * Returns the data received by this socket stub.
     * @returns any[], the received data.
     */
    getData(): any[] { return this.#data; }
}

/**
 * Tests that WebSocket client properly parses
 * and processes messages - routing messages correctly
 * to subscribed clients.
 */
describe("WebSocket Client", () => {
    it("ws::Should process message", () => {
        // Initialization
        const subId = "sub-id";
        const ws = new SocketStub();

        expect(ws.getData().length).to.equal(0);

        // Helper to encode json into byte array
        const rawData = (json: object) => {
            return Buffer.from(JSON.stringify(
                json
            ))
        }

        // Send a subscription request for client 1
        expect(Object.keys(clients).length).to.equal(0)
        deepLog("Sending subscription request from client 1 to subid: " + subId)
        processMessage(ws as any, rawData({
            topic: "subscribe",
            payload: {
                userID: subId
            }
        }));
        // Should have a new client and a subscription success response.
        expect(Object.keys(clients).length).to.equal(1)
        expect(ws.getData().length).equal(1) // subscription response
        deepLog("Got response")
        deepLog(ws.getData()[0])

        
        // Send a topic message from a client that no client is subscribed to, 
        // nothing should happen.
        processMessage(ws as any, rawData({
            topic: "something",
            userID: "randomId",
            payload: {
                field: "random"
            }
        }));

        deepLog("Sending topic msg from client 2 (not sub)")
        expect(ws.getData().length).equal(1) // no acks for send msg
        deepLog("No additional responses")
        deepLog(ws.getData())

        
        // Send a topic message from subId client, our socket
        // should receive this message
        const messageToClient = {
            topic: "topic-name",
            userID: subId,
            payload: {
                field: "field-name"
            }
        }
        deepLog("Sending topic msg from client sub (subbed)")
        deepLog("CLIENT 2 SENT")
        deepLog(messageToClient)
        processMessage(new SocketStub() as any, rawData(messageToClient))
        
        const msgReceive = {topic: messageToClient.topic, payload: messageToClient.payload}
        expect(ws.getData().length).equal(2)    // we should be subscribed to this msg
        
        // Assert that the received message is the topic and payload.
        const actualReceive = JSON.parse(ws.getData()[1]);
        expect(actualReceive).to.deep.equal(msgReceive)
        deepLog("RECEIVED")
        deepLog(actualReceive)
    })
});