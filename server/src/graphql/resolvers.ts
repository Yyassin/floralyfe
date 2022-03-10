import { PubSub } from "graphql-yoga";
import { ID } from "../models/common";
import { 
    Vital, 
    User,
    Note,
    Plant,
    Notification } from "../models";
import { GraphQLDateTime } from "graphql-iso-date";
import { GraphQLJSONObject } from 'graphql-type-json';

const pubsub = new PubSub();

const customScalarResolver = {
    Date: GraphQLDateTime,
    JSON: GraphQLJSONObject
};

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
