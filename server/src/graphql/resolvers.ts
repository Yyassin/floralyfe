/**
 * resolvers.ts
 * 
 * Joins all model resolvers.
 * @author Yousef 
 */

import { PubSub } from "graphql-yoga";
import { 
    Vital, 
    User,
    Note,
    Plant,
    Notification } from "../models";
import { GraphQLDateTime } from "graphql-iso-date";
import { GraphQLJSONObject } from 'graphql-type-json';

// Publisher-subscriber async iterator for subscriptions.
const pubsub = new PubSub();

// Custom Date (ISO) and JSON resolvers.
const customScalarResolver = {
    Date: GraphQLDateTime,
    JSON: GraphQLJSONObject
};

// Joined resolvers
const resolvers = {
    ...customScalarResolver,
    Query: {
        ...Vital.queries(),
        ...User.queries(),
        ...Note.queries(),
        ...Plant.queries(),
        ...Notification.queries(),
    },
    Mutation: {
        ...Vital.mutations(pubsub),
        ...Notification.mutations(pubsub),
        ...User.mutations(),
        ...Note.mutations(),
        ...Plant.mutations(),
    },
    Subscription: {
        ...Vital.subscriptions(pubsub),
        ...Notification.subscriptions(pubsub)
    },
};

export { resolvers };
