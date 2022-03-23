import "mocha";
import { expect } from "chai";
import { server, expressPort } from "../src/server";
import superwstest from "superwstest";
import { deepLog } from "../src/util";

const request = superwstest(server);
const socket = superwstest(`ws://localhost:${expressPort}`);

describe("/test endpoint", () => {
    it("should return a response", async () => {
        const response = await request.get("/test");
        expect(response.status).to.eq(200);
        expect(response.text).eq("Test passed!");
    });

    it("communicates via websockets", async () => {
        socket.ws("").expectText("connection established.");
    });

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
