import { Collections, ID } from "./common";
import { DocumentData } from "@firebase/firestore-types";
import FirestoreDocument from "./FirestoreDocument";
import { PubSub } from "graphql-yoga";

enum NotificationType {
    VITAL_CRITICAL="VITAL_CRITICAL",
    WATER_TANK_LOW="WATER_TANK_LOW",
    REFILLED_WATER_TANK="REFILLED_WATER_TANK"
}

interface INotification {
    id: ID;
    label: string;
    type: NotificationType;
    plantID: string;
    createdAt: string;
};

type createNotificationArgs = Omit<INotification, "id" | "updatedAt"> & { deviceID: ID };
type subscribeNotificationArgs = { deviceID: ID };


const gql = String.raw;
const schemaType = gql`
    type Notification {
        id: ID!
        label: String!
        type: String!
        plantID: ID!
        createdAt: Date! 
    }
    
    type NotificationSubscriptionPayload {
        mutation: String!
        data: Notification!
    }   
`;


const mutation = gql`
    createNotification(
        label: String!
        type: String!
        plantID: ID!
        deviceID: ID!
    ): Notification!

    deleteNotification(id: ID!): Boolean!
`;

const subscription = gql`
    notification(deviceID: ID!): NotificationSubscriptionPayload!
`;

const query = gql`
    notification(plantID: ID!): [Notification]
`;

class Notification extends FirestoreDocument<INotification, createNotificationArgs> {
    constructor() {
        super(Collections.NOTIFICATIONS);
    }

    public async getByPlantID(plantID: string): Promise<INotification[]> {
        const snapshot = await this.model.where("plantID", "==", plantID).get();
        return snapshot.docs.map((doc: DocumentData) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
}

const notification = new Notification();

const getNotificationsByPlantID = async (args: { plantID: string }) => {
    return await notification.getByPlantID(args.plantID);
}

const createNotification = async (
    args: createNotificationArgs,
    pubsub: PubSub
): Promise<INotification> => {
    const { deviceID } = args;
    delete args["deviceID"];

    args["createdAt"] = new Date().toISOString();

    const { id } = await notification.create(args);

    const snapshot = {
        id,
        ...(await notification.get(id)),
    };

    pubsub.publish(`notification-${deviceID}`, {
        notification: {
            mutation: "CREATED",
            data: snapshot,
        },
    });

    return snapshot;
}

const deleteNotification = async (
    { id }: any
): Promise<Boolean> => {
    await notification.delete(id);

    return true;
};

const subscribeNotifications = async (args: subscribeNotificationArgs, pubsub: PubSub) => {
    return pubsub.asyncIterator(`notification-${args.deviceID}`);
};

const queries = () => ({
    notification: (_, args) => getNotificationsByPlantID(args),
});

const mutations = (pubsub: PubSub) => ({
    createNotification: (_, args) => createNotification(args, pubsub),
    deleteNotification: (_, args) => deleteNotification(args),
});

const subscriptions = (pubsub: PubSub) => ({
    notification: {
        subscribe: (_, args) => subscribeNotifications(args, pubsub),
    },
});

export { 
    queries, 
    mutations, 
    subscriptions, 
    INotification, 
    notification, 
    schemaType, 
    subscription, 
    mutation,
    query
};
