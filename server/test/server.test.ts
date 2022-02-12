import "mocha";
import { expect,  } from "chai";
import { server } from "../src/server";
import supertest from "supertest";

const request = supertest(server);

describe("/test endpoint",() => {
    it("should return a response", async () => {
        const response = await request.get("/")
        expect(response.status).to.eq(200)
        expect(response.text).eq("Hello world!");
    })
})