import "mocha";
import { expect } from "chai";
import { graphQLPort } from "../src/server";
import superwstest from "superwstest";
import { before } from "mocha";
import { Note } from "../src/models";
import { debug, deepLog } from "../src/util";

const request = superwstest(`http://localhost:${graphQLPort}`);

const gql = String.raw;
const expected = {
    title: "demo-title",
    text: "demo-text",
    plantID: "demo-plantID"
}

const createNoteQuery = gql`
    mutation create_note ($title: String!, $text: String!, $plantID: String!){
        createNote(title: $title, text: $text, plantID: $plantID){
            id
            title
            text
            plantID
            updatedAt
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
describe("GraphQL Note", () => {
    before(async function () {
        this.timeout(0);
        // Warmup
        const response = await request
            .post("/graphql")
            .send({query: getVitalsQuery, variables: {plantID: ""}});
        expect(response.status).to.eq(200);
    });

    it("note::Should create and read a note", async () => {
        const response = await request
            .post("/graphql")
            .send({query: createNoteQuery, variables: expected});

        expect(response.status).to.eq(200);

        deepLog("CREATED NOTE")
        deepLog(expected)

        const note = response.body.data.createNote as Note.INote;
        const noteDate = Date.parse(note.updatedAt);
        delete note["updatedAt"]

        expect(note).to.deep.equal({...expected, id: note.id})
        
        const now = Date.now();
        const diffTime = Math.abs(now - noteDate) / 1000;

        expect(diffTime).to.below(10);

        expect(note).to.deep.equal({...expected, id: note.id})

        const document = await Note.note.get(note.id);
        delete document["updatedAt"]

        console.log("\n")
        debug("READING NOTE with id: " + note.id)
        deepLog(document)

        expect(document).to.deep.equal({...expected})
        // id = vital.id;
    });
});
