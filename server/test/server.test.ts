/**
 * server.test.ts
 * 
 * Tests Server endpoints.
 * @author Yousef
 */

import "mocha";
import { expect } from "chai";
import { server, expressPort } from "../src/server";
import superwstest from "superwstest";
import { deepLog } from "../src/util";

// Connect to the server and open a WebSocket instance.
const request = superwstest(server);
const socket = superwstest(`ws://localhost:${expressPort}`);

/**
 * Tests that server endpoints are reachable.
 */
describe("/test endpoint", () => {
    // Ensure the server is reachable.
    it("should return a response", async () => {
        const response = await request.get("/test");
        expect(response.status).to.eq(200);
        expect(response.text).eq("Test passed!");
    });

    // Ensure the WebSocket Server is reachable
    it("communicates via websockets", async () => {
        socket.ws("").expectText("connection established.");
    });

    // Ensure email notification endpoint is reachable.
    it("sends email", async () => {
        const emailPayload = {
            to: "you.ayassin@gmail.com",
            subject: "Your Plant - PlantName - needs your attention!",
            text: "Hey there",
            html: "<b>Hey there</b>",
        };

        deepLog("SENDING EMAIL WITH DATA")
        deepLog(emailPayload)

        // Mock won't actually send
        const response = await request.post("/notification/sendEmail").send({email: emailPayload});

        expect(response.status).to.eq(200);
        expect(response.text).eq("Sent Email!");
    })
});
