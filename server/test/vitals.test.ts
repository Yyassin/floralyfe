import "mocha";
import { expect } from "chai";
import { graphQLPort } from "../src/server";
import superwstest from "superwstest";
import { before } from "mocha";
import { Vital } from "../src/models";
import { debug, deepLog } from "../src/util";

const request = superwstest(`http://localhost:${graphQLPort}`);

const gql = String.raw;
const expected = {
    soilMoisture: 9,
    temperature: 10,
    airHumidity: 11,
    light: 12,
    greenGrowth: 13,
    plantID: "plant-id",
    deviceID: "device-id"
}

const createVitalQuery = gql`
    mutation{
        createVital(
            soilMoisture: ${expected.soilMoisture}, 
            airHumidity: ${expected.airHumidity}, 
            temperature: ${expected.temperature}, 
            light: ${expected.light},
            greenGrowth: ${expected.greenGrowth}
            plantID: "${expected.plantID}",
            deviceID: "${expected.deviceID}"
        ) {
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
expected.plantID = expected.plantID.replace(/['"]+/g, '');
expected.plantID = expected.plantID.replace(/['"]+/g, '');

let id: string;
describe("GraphQL Vitals", () => {
    before(async function () {
        this.timeout(0);
        // Warmup
        const response = await request
            .post("/graphql")
            .send({query: getVitalsQuery, variables: {plantID: "plant-id"}});
        expect(response.status).to.eq(200);
    });

    it("vital::Should create and read vital", async () => {
        const response = await request
            .post("/graphql")
            .send({query: createVitalQuery});

        expect(response.status).to.eq(200);

        deepLog("CREATED VITAL")
        deepLog(expected)


        const vital = response.body.data.createVital as Vital.IVital;
        expect(vital.id).to.be.a("string");
        expect(vital.soilMoisture).to.eq(expected.soilMoisture)
        expect(vital.temperature).to.eq(expected.temperature)
        expect(vital.airHumidity).to.eq(expected.airHumidity)
        expect(vital.plantID).to.eq(expected.plantID)
        
        const vitalDate = Date.parse(vital.createdAt);
        const now = Date.now();
        const diffTime = Math.abs(now - vitalDate) / 1000;

        expect(diffTime).to.below(10);

        const document = await Vital.vital.get(vital.id);

        debug("\nREADING VITAL with id: " + vital.id)
        deepLog(document)

        expect(vital.soilMoisture).to.eq(document.soilMoisture)
        expect(vital.temperature).to.eq(document.temperature)
        expect(vital.airHumidity).to.eq(document.airHumidity)
        expect(vital.plantID).to.eq(document.plantID)
        expect(vital.createdAt).to.eq(document.createdAt)

        id = vital.id;
    });
});
