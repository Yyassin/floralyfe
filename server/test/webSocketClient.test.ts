import "mocha";
import { expect } from "chai";
import { graphQLPort } from "../src/server";
import superwstest from "superwstest";
import { before } from "mocha";
import { User } from "../src/models";
import { debug, deepLog } from "../src/util";
import { addSubscription, clients, processMessage } from "../src/setupWebSocket";

class SocketStub {
    #data: any[]

    constructor() {
        this.#data = [];
    }

    send(data: any) {
        this.#data.push(data);
    }

    getData() { return this.#data; }
}

describe("WebSocket Client", () => {
    it("ws::Should process message", () => {
        const subId = "sub-id";
        const ws = new SocketStub();

        expect(ws.getData().length).to.equal(0);

        const rawData = (json: object) => {
            return Buffer.from(JSON.stringify(
                json
            ))
        }


        expect(Object.keys(clients).length).to.equal(0)
        deepLog("Sending subscription request from client 1 to subid: " + subId)
        processMessage(ws as any, rawData({
            topic: "subscribe",
            payload: {
                userID: subId
            }
        }));
        expect(Object.keys(clients).length).to.equal(1)
        expect(ws.getData().length).equal(1) // subscription response
        deepLog("Got response")
        deepLog(ws.getData()[0])


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
        
        const actualReceive = JSON.parse(ws.getData()[1]);
        expect(actualReceive).to.deep.equal(msgReceive)
        deepLog("RECEIVED")
        deepLog(actualReceive)
    })
});