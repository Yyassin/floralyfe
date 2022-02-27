import { PubSub } from "graphql-yoga";
import { ID } from "../models/common";
import { Vital } from "../models";
import { GraphQLDateTime } from "graphql-iso-date";

const pubsub = new PubSub();

const customScalarResolver = {
    Date: GraphQLDateTime,
};

const resolvers = {
    ...customScalarResolver,
    Query: {
        ...Vital.queries(),
    },
    Mutation: {
        ...Vital.mutations(pubsub),
    },
    Subscription: {
        ...Vital.subscriptions(pubsub),
    },
};

export { resolvers };
