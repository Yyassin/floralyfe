import "mocha";
import { expect } from "chai";
import { graphQLPort } from "../src/server";
import superwstest from "superwstest";
import { before } from "mocha";
import { Notification } from "../src/models";
import { debug, deepLog } from "../src/util";

const request = superwstest(`http://localhost:${graphQLPort}`);

const gql = String.raw;
const expected = {
    label: "demo-label",
    type: "demo-type",
    plantID: "demo-plantID",
    deviceID: "demo-deviceID"
}

const createNotificationQuery = gql`
    mutation create_notification($label: String!,
                                    $type: String!,
                                    $plantID: ID!,
                                    $deviceID: ID!){
        createNotification(label: $label,
                            type: $type,
                            plantID: $plantID,
                            deviceID: $deviceID){
            id
            label
            type
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

let id: string;
describe("GraphQL Notifications", () => {
    before(async function () {
        this.timeout(0);
        // Warmup
        const response = await request
            .post("/graphql")
            .send({query: getVitalsQuery, variables: {plantID: ""}});
        expect(response.status).to.eq(200);
    });

    it("notification::Should create and read a notification", async () => {
        const response = await request
            .post("/graphql")
            .send({query: createNotificationQuery, variables: expected});

        delete expected["deviceID"] //only used for subscriptions

        expect(response.status).to.eq(200);

        deepLog("CREATED NOTIFICATION")
        deepLog(expected)

        const notification = response.body.data.createNotification as Notification.INotification;
        const notificationDate = Date.parse(notification.createdAt);
        delete notification["createdAt"]

        expect(notification).to.deep.equal({...expected, id: notification.id})
        
        const now = Date.now();
        const diffTime = Math.abs(now - notificationDate) / 1000;

        expect(diffTime).to.below(10);

        expect(notification).to.deep.equal({...expected, id: notification.id})

        const document = await Notification.notification.get(notification.id);
        delete document["createdAt"]
        delete document["updatedAt"]

        console.log("\n")
        debug("READING NOTIFICATION with id: " + notification.id)
        deepLog(document)

        expect(document).to.deep.equal({...expected})
        // id = vital.id;
    });
});
