import { PubSub } from "graphql-yoga";
import { Collections, ID } from "./common";
import FirestoreDocument from "./FirestoreDocument";
import { DocumentData } from "@firebase/firestore-types";

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

const subscription = gql`
    vital(deviceID: ID!): VitalSubscriptionPayload!
    `;
const query = gql`
    vitals(plantID: ID!): [Vital]
`;

class Vital extends FirestoreDocument<IVital, createVitalArgs> {
    constructor() {
        super(Collections.VITALS);
    }

    public async getByPlantID(plantID: string): Promise<IVital[]> {
        const snapshot = await this.model.where("plantID", "==", plantID).get();
        return snapshot.docs.map((doc: DocumentData) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
}

const vital = new Vital();

const getVitalsByPlantID = async (args: { plantID: string }) => {
    console.log(args.plantID)
    return await vital.getByPlantID(args.plantID);
};

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

const subscribeVitals = async (args: subscribeVitalArgs, pubsub: PubSub) => {
    return pubsub.asyncIterator(`vital-${args.deviceID}`);
};

const queries = () => ({
    vitals: (_, args) => getVitalsByPlantID(args),
});

const mutations = (pubsub: PubSub) => ({
    createVital: (_, args) => createVital(args, pubsub),
    updateVital: (_, args) => updateVital(args, pubsub),
    deleteVital: (_, args) => deleteVital(args, pubsub),
});

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
