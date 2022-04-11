/**
 * Vital.ts
 * 
 * The Vital model. Defines the Vital
 * type and associated resolvers.
 * @author Yousef 
 */

import { PubSub } from "graphql-yoga";
import { Collections, ID } from "./common";
import FirestoreDocument from "./FirestoreDocument";
import { DocumentData } from "@firebase/firestore-types";
import { deepLog } from "../util";

// Structure of plant sensor measurement vital
interface IVital {
    id: ID;
    soilMoisture: number;
    temperature: number;
    airHumidity: number;
    light: number;
    greenGrowth: number;
    plantID: number;
    createdAt: string;
}
type updateVitalArgs = Omit<IVital, "createdAt"> & { deviceID: ID };
type createVitalArgs = Omit<IVital, "id" | "createdAt"> & { deviceID: ID };
type deleteVitalArgs = { id: ID; deviceID: ID };
type subscribeVitalArgs = { deviceID: ID };

// The GraphQL Schema Type
const gql = String.raw;
const schemaType = gql`
    type Vital {
        id: ID!
        soilMoisture: Float!
        temperature: Float!
        airHumidity: Float!
        light: Float!
        greenGrowth: Float!
        plantID: ID!
        createdAt: Date!
    }
    
    type VitalSubscriptionPayload {
        mutation: String!
        data: Vital!
    }   
`;

// The GraphQL mutation interfaces
const mutation = gql`
    createVital(
        soilMoisture: Float!
        temperature: Float!
        airHumidity: Float!
        light: Float!
        greenGrowth: Float!
        plantID: ID!
        deviceID: ID!
    ): Vital!

    updateVital(
        id: ID!
        soilMoisture: Float!
        temperature: Float!
        airHumidity: Float!
        light: Float!
        greenGrowth: Float!
        plantID: ID!
        deviceID: ID!
    ): Boolean!
    deleteVital(id: ID!, deviceID: ID!): Boolean!`;

// The GraphQL subscription interfaces
const subscription = gql`
    vital(deviceID: ID!): VitalSubscriptionPayload!
    `;

// The GraphQL query interfaces
const query = gql`
    vitals(plantID: ID!): [Vital]
`;

/**
 * Vital model helper.
 */
class Vital extends FirestoreDocument<IVital, createVitalArgs> {
    constructor() {
        super(Collections.VITALS);
    }

    /**
     * Returns vitals filtered by the specified plantID.
     * @param plantID string, the plantID to filter by.
     * @returns Promise<IVital[]>, the vitals matching the specified plant id.
     */
    public async getByPlantID(plantID: string): Promise<IVital[]> {
        const snapshot = await this.model.where("plantID", "==", plantID).get();
        return snapshot.docs.map((doc: DocumentData) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
}

const vital = new Vital();

/**
 * Returns the vitals matching the specified plantID.
 * @param args, the plant ID to filter with.
 * @returns Promise<IVital[]>, the vitals matching the specified plant id.
 */
const getVitalsByPlantID = async (args: { plantID: string }) => {
    console.log(args.plantID)
    return await vital.getByPlantID(args.plantID);
};

/**
 * Creates a vital with the specified parameters.
 * @param args, the information to create a vital with.
 * @returns Promise<IVital[]>, the created vital.
 */
const createVital = async (
    args: createVitalArgs,
    pubsub: PubSub
): Promise<IVital> => {
    const { deviceID } = args;
    delete args["deviceID"];

    args["createdAt"] = new Date().toISOString();

    const { id } = await vital.create(args);

    const snapshot = {
        id,
        ...(await vital.get(id)),
    };

    pubsub.publish(`vital-${deviceID}`, {
        vital: {
            mutation: "CREATED",
            data: snapshot,
        },
    });

    return snapshot;
};

/**
 * Deletes the vital with the specified id.
 * @param args, the id of the vital to delete.
 * @returns Promise<Boolean>, returns true if deleted successfully.
 */
const deleteVital = async (
    { id, deviceID }: deleteVitalArgs,
    pubsub: PubSub
): Promise<Boolean> => {
    await vital.delete(id);

    pubsub.publish(`vital-${deviceID}`, {
        vital: {
            mutation: "DELETED",
            data: { id },
        },
    });

    return true;
};

/**
 * Updates a vitals with the specified parameters.
 * @param args, the information to update the vital with.
 * @returns Promise<IVital[]>, the created vital.
 */
const updateVital = async (
    args: updateVitalArgs,
    pubsub: PubSub
): Promise<Boolean> => {
    const { id, deviceID } = args;
    delete args["id"];
    delete args["deviceID"];

    await vital.update(id, args);

    const snapshot = {
        id,
        ...(await vital.get(id)),
    };

    pubsub.publish(`vital-${deviceID}`, {
        vital: {
            mutation: "UPDATED",
            data: snapshot,
        },
    });

    return true;
};

/**
 * Subscribes to vitals created by the specified deviceID.
 * @param args, the deviceID to subscribe to vitals from.
 * @param pubsub, PubSub the pub sub async iterator.
 * @returns asyncIterator subscribed to vitals creations
 *          from the specified deviceID.
 */
const subscribeVitals = async (args: subscribeVitalArgs, pubsub: PubSub) => {
    console.log("Got subscription")
    deepLog(args)
    return pubsub.asyncIterator(`vital-${args.deviceID}`);
};

// All vital queries
const queries = () => ({
    vitals: (_, args) => getVitalsByPlantID(args),
});

// All vital mutations
const mutations = (pubsub: PubSub) => ({
    createVital: (_, args) => createVital(args, pubsub),
    updateVital: (_, args) => updateVital(args, pubsub),
    deleteVital: (_, args) => deleteVital(args, pubsub),
});

// All vital subscriptions
const subscriptions = (pubsub: PubSub) => ({
    vital: {
        subscribe: (_, args) => subscribeVitals(args, pubsub),
    },
});

export { 
    queries, 
    mutations, 
    subscriptions, 
    IVital, 
    vital, 
    schemaType, 
    subscription, 
    mutation,
    query,
    getVitalsByPlantID 
};
