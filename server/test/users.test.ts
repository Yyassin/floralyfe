/**
 * users.test.ts
 * 
 * Tests graphql endpoints for Users.
 * @author Yousef
 */

import "mocha";
import { expect } from "chai";
import { graphQLPort } from "../src/server";
import superwstest from "superwstest";
import { before } from "mocha";
import { User } from "../src/models";
import { debug, deepLog } from "../src/util";

// Connect to the server
const request = superwstest(`http://localhost:${graphQLPort}`);

// Expected values.
const gql = String.raw;
const expected = {
    firstName: "demo-firstName",
    lastName: "demo-lastName",
    username: "demo-username",
    email: "demo-email",
    password: "demo-password"
}

// Create user query.
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

/**
 * Vital query for before each - warms up
 * the test suite so the rest of the tests
 * execute quickly.
 */
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

/**
 * Tests reading, writing and updating a User.
 */
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
        // Create a user.
        const response = await request
            .post("/graphql")
            .send({query: createUserQuery, variables: expected});

        expect(response.status).to.eq(200);

        deepLog("CREATED USER")
        deepLog(expected)

        // Validate the user against expected values.
        const user = response.body.data.createUser as User.IUser;
        const userDate = Date.parse(user.createdAt);
        delete user["createdAt"]

        expect(user).to.deep.equal({...expected, id: user.id})
        
        const now = Date.now();
        const diffTime = Math.abs(now - userDate) / 1000;

        expect(diffTime).to.below(10);

        // Validate that the user was properly published to the database.
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
