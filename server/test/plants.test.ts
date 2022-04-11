/**
 * plants.test.ts
 * 
 * Tests graphql endpoints for Plants.
 * @author Yousef
 */

import "mocha";
import { expect } from "chai";
import { graphQLPort } from "../src/server";
import superwstest from "superwstest";
import { before } from "mocha";
import { Plant } from "../src/models";
import { debug, deepLog } from "../src/util";

// Connect to the server.
const request = superwstest(`http://localhost:${graphQLPort}`);

// Expected values.
const gql = String.raw;
const expected = {
    name: "demo-name",
    species: "demo-species",
    cameraAngle: 10,
    optima: {
        temperature: 11,
        soilMoisture: 12,
        humidity: 13
    },
    ownerID: "demo-ownerID"
}

// Create plant query
const createPlantQuery = gql`
    mutation create_plant ($name: String!,
                            $species: String!,
                            $cameraAngle: Float!,
                            $optima: OptimaInput!,
                            $ownerID: ID!){
        createPlant(name: $name,
                    species: $species,
                    cameraAngle: $cameraAngle,
                    optima: $optima,
                    ownerID: $ownerID){
            id
            name
            species
            cameraAngle
            optima{
                temperature
                soilMoisture
                humidity
            }
            ownerID
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
 * Tests reading, writing and updating a Plant.
 */
let id: string;
describe("GraphQL Plants", () => {
    before(async function () {
        this.timeout(0);
        // Warmup
        const response = await request
            .post("/graphql")
            .send({query: getVitalsQuery, variables: {plantID: "plant-id"}});
        expect(response.status).to.eq(200);
    });

    it("plant::Should create and read a plant", async () => {
        // Create the plant.
        const response = await request
            .post("/graphql")
            .send({query: createPlantQuery, variables: expected});

        expect(response.status).to.eq(200);

        deepLog("CREATED PLANT")
        deepLog(expected)

        // Validate plant against expected data.
        const plant = response.body.data.createPlant as Plant.IPlant;

        expect(plant).to.deep.equal({...expected, id: plant.id})

        // Validate the plant was created properly in database.
        const document = await Plant.plant.get(plant.id);
        delete document["createdAt"]
        delete document["updatedAt"]

        console.log("\n")
        debug("READING PLANT with id: " + plant.id)
        deepLog(document)

        expect(document).to.deep.equal({...expected})
        // id = vital.id;
    });
});
