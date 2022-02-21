import "mocha";
import { expect,  } from "chai";
import { server } from "../src/server";
import superwstest from "superwstest";

const request = superwstest(server);
const socket = superwstest("ws://localhost:4000");

describe("/test endpoint",() => {
    it("should return a response", async () => {
        const response = await request.get("/")
        expect(response.status).to.eq(200)
        expect(response.text).eq("Hello world!");
    })

    it("communicates via websockets", async () => {
        socket.ws("")
              .expectText("connection established.");
    })
})