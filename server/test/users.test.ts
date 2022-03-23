import "mocha";
import { expect } from "chai";
import { graphQLPort } from "../src/server";
import superwstest from "superwstest";
import { before } from "mocha";
import { User } from "../src/models";
import { debug, deepLog } from "../src/util";

const request = superwstest(`http://localhost:${graphQLPort}`);

const gql = String.raw;
const expected = {
    firstName: "demo-firstName",
    lastName: "demo-lastName",
    username: "demo-username",
    email: "demo-email",
    password: "demo-password"
}

const createUserQuery = gql`
    mutation create_user ($firstName: String!,
                            $lastName: String!,
                            $username: String!,
                            $email: String!,
                            $password: String!){
        createUser(firstName:$firstName,
                    lastName: $lastName,
                    username: $username,
                    email: $email,
                    password: $password){
            id
            firstName
            lastName
            username
            email
            password
            createdAt
        }
    }
`;

const getVitalsQuery = gql`
    query view_vitals($plantID: ID!){
        vitals(plantID: $plantID){
            id
            soilMoisture
            temperature
            airHumidity
            light
            greenGrowth
            plantID
            createdAt
        }
    }
`

let id: string;
describe("GraphQL Users", () => {
    before(async function () {
        this.timeout(0);
        // Warmup
        const response = await request
            .post("/graphql")
            .send({query: getVitalsQuery, variables: {plantID: "plant-id"}});
        expect(response.status).to.eq(200);
    });

    it("user::Should create and read a user", async () => {
        const response = await request
            .post("/graphql")
            .send({query: createUserQuery, variables: expected});

        expect(response.status).to.eq(200);

        deepLog("CREATED USER")
        deepLog(expected)

        const user = response.body.data.createUser as User.IUser;
        const userDate = Date.parse(user.createdAt);
        delete user["createdAt"]

        expect(user).to.deep.equal({...expected, id: user.id})
        
        const now = Date.now();
        const diffTime = Math.abs(now - userDate) / 1000;

        expect(diffTime).to.below(10);

        const document = await User.user.get(user.id);
        delete document["createdAt"]
        delete document["updatedAt"]

        console.log("\n")
        debug("READING USER with id: " + user.id)
        deepLog(document)

        expect(document).to.deep.equal({...expected, subscribedNotifications: true})
        // id = vital.id;
    });
});
