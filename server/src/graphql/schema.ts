/**
 * schema.ts
 * 
 * Joins all model schemas.
 * @author Yousef 
 */

import { 
    Vital, 
    User,
    Note,
    Plant,
    Notification
} from "../models";
const gql = String.raw;

// General models
const models = [
    Vital, User, Note, Plant, Notification
];

// Models that support subscription streaming
const streamedModels = [
    Vital, Notification
];

// Joined type definitions.
const typeDefs = gql`
    scalar Date
    scalar JSON

    ${models.map(model => 
        model.schemaType
    )}

    type Query {
        ${models.map(model => 
            model.query
        )}
    }

    type Mutation {
        ${models.map(model => 
            model.mutation
        )}
    }

    type Subscription {
        ${streamedModels.map(model => 
            model.subscription
        )}
    }
`;

export { typeDefs };
