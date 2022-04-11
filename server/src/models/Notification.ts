/**
 * Notification.ts
 * 
 * The Notification model. Defines the Notification
 * type and associated resolvers.
 * @author Yousef 
 */

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


// The GraphQL Schema Type
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

// The GraphQL mutation interfaces
const mutation = gql`
    createNotification(
        label: String!
        type: String!
        plantID: ID!
        deviceID: ID!
    ): Notification!

    deleteNotification(id: ID!): Boolean!
`;

// The GraphQL subscription interfaces
const subscription = gql`
    notification(deviceID: ID!): NotificationSubscriptionPayload!
`;

// The GraphQL query interfaces
const query = gql`
    notification(plantID: ID!): [Notification]
`;

/**
 * Notification model helper.
 */
class Notification extends FirestoreDocument<INotification, createNotificationArgs> {
    constructor() {
        super(Collections.NOTIFICATIONS);
    }

    /**
     * Returns notifications filtered by the specified plantID.
     * @param plantID string, the plantID to filter by.
     * @returns Promise<INotification[]>, the notifications matching the specified plant id.
     */
    public async getByPlantID(plantID: string): Promise<INotification[]> {
        const snapshot = await this.model.where("plantID", "==", plantID).get();
        return snapshot.docs.map((doc: DocumentData) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
}

const notification = new Notification();

/**
 * Returns the notifications matching the specified plantID.
 * @param args, the plant ID to filter with.
 * @returns Promise<INote[]>, the notifications matching the specified plant id.
 */
const getNotificationsByPlantID = async (args: { plantID: string }) => {
    return await notification.getByPlantID(args.plantID);
}

/**
 * Creates a notification with the specified parameters.
 * @param args, the information to create a notification with.
 * @returns Promise<INotification[]>, the created notification.
 */
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

/**
 * Deletes the notification with the specified id.
 * @param args, the id of the notification to delete.
 * @returns Promise<Boolean>, returns true if deleted successfully.
 */
const deleteNotification = async (
    { id }: any
): Promise<Boolean> => {
    await notification.delete(id);

    return true;
};

/**
 * Subscribes to notifications created by the specified deviceID.
 * @param args, the deviceID to subscribe to notitifications from.
 * @param pubsub, PubSub the pub sub async iterator.
 * @returns asyncIterator subscribed to notification creations
 *          from the specified deviceID.
 */
const subscribeNotifications = async (args: subscribeNotificationArgs, pubsub: PubSub) => {
    return pubsub.asyncIterator(`notification-${args.deviceID}`);
};

// All notification queries
const queries = () => ({
    notification: (_, args) => getNotificationsByPlantID(args),
});

// All notification mutations
const mutations = (pubsub: PubSub) => ({
    createNotification: (_, args) => createNotification(args, pubsub),
    deleteNotification: (_, args) => deleteNotification(args),
});

// All notification subscriptions
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
