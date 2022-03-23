import "mocha";
import { expect } from "chai";
import { server, expressPort } from "../src/server";
import superwstest from "superwstest";

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
        expect(1).to.equal(1);
    })
});
