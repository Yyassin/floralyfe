import "mocha";
import { expect } from "chai";
import { graphQLPort } from "../src/server";
import superwstest from "superwstest";
import { before } from "mocha";
import { Vital } from "../src/models";

const request = superwstest(`http://localhost:${graphQLPort}`);

const gql = String.raw;
const expected = {
    soilMoisture: 1.0,
    updatedSoilMoisture: 2.0, 
    airHumidity: 2.0,
    updatedAirHumidity: 3.0,
    temperature: 3.0,
    updatedTemperature: 3.5,
    plantID: "plant",
    updatedPlantID: "hey"
}

const createVitalQuery = gql`
    mutation{
        createVital(
            soilMoisture: ${expected.soilMoisture}, 
            airHumidity: ${expected.airHumidity}, 
            temperature: ${expected.temperature}, 
            plantID: "${expected.plantID}",
            deviceID: "hello"
        ) {
            id
            soilMoisture
            temperature
            airHumidity
            plantID
            createdAt
        }
    }
`;

const updateVitalQuery = (id: string) => gql`
    mutation{
        updateVital(
            id: "${id}", 
            soilMoisture: ${expected.updatedSoilMoisture}, 
            airHumidity: ${expected.updatedAirHumidity}, 
            temperature: ${expected.updatedTemperature}, 
            plantID: "${expected.updatedPlantID}", 
            deviceID: "hello"
            )
    }
`

const getVitalsQuery = gql`
    query {
        vitals {
            id
            soilMoisture
            temperature
            airHumidity
            plantID
            createdAt
        }
    }
`
expected.plantID = expected.plantID.replace(/['"]+/g, '');
expected.updatedPlantID = expected.updatedPlantID.replace(/['"]+/g, '');

let id: string;
describe("GraphQL", () => {
    before(async function () {
        this.timeout(0);
        // Warmup
        const response = await request
            .post("/graphql")
            .send({query: createVitalQuery});
        
        expect(response.status).to.eq(200);
    });

    it("Should create a vital", async () => {
        const response = await request
            .post("/graphql")
            .send({query: createVitalQuery});

        expect(response.status).to.eq(200);

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
        expect(vital.soilMoisture).to.eq(document.soilMoisture)
        expect(vital.temperature).to.eq(document.temperature)
        expect(vital.airHumidity).to.eq(document.airHumidity)
        expect(vital.plantID).to.eq(document.plantID)
        expect(vital.createdAt).to.eq(document.createdAt)

        id = vital.id;
    });

    // Won't be really be used (but this our first test)
    it("Should update vital", async () => {
        const response = await request
            .post("/graphql")
            .send({query: updateVitalQuery(id)});

        expect(response.status).to.eq(200);
        
        const result = response.body.data.updateVital;
        expect(result).to.eq(true);
        
        const document = await Vital.vital.get(id);
        expect(expected.updatedSoilMoisture).to.eq(document.soilMoisture)
        expect(expected.updatedTemperature).to.eq(document.temperature)
        expect(expected.updatedAirHumidity).to.eq(document.airHumidity)
        expect(expected.updatedPlantID).to.eq(document.plantID)
    })

    it("Should get all vitals", async () => {
        const response = await request
            .post("/graphql")
            .send({query: getVitalsQuery});

        expect(response.status).to.eq(200);
    
        const vitals = response.body.data.vitals;
        expect(vitals.length).to.eq(2);

        const vital = vitals[0] as Vital.IVital;

        expect(vital.id).to.be.a('string');
        expect(vital.soilMoisture).to.be.a('number');
        expect(vital.airHumidity).to.be.a('number');
        expect(vital.temperature).to.be.a('number');
        expect(vital.createdAt).to.be.a('string');
    })

    // Not testing subscriptions since there isn't a nice
    // way to do async things :/
});
