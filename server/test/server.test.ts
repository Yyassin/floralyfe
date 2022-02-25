import "mocha";
import { expect,  } from "chai";
import { server, port } from "../src/server";
import superwstest from "superwstest";

const request = superwstest(server);
const socket = superwstest(`ws://localhost:${port}`);

describe("/test endpoint",() => {
    it("should return a response", async () => {
        const response = await request.get("/");
        expect(response.status).to.eq(200);
        expect(response.text).eq("Hello world!");
    })

    it("communicates via websockets", async () => {
        socket.ws("")
              .expectText("connection established.");
    })

    it("create user", async () => {
        const user = {
            name: "Max",
            age: 25
        };
        const response = await request
            .post("/create")
            .send(user)
        
        expect(response.status).to.eq(200);
        expect(response.body.msg).to.eq("User added.");
    })

    it("get users", async () => {
        const response = await request
            .get("/users")
        
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(1);

        const user = response.body[0];

        expect(user.name).to.eq("Max")
        expect(user.age).to.eq(25)
    })
})