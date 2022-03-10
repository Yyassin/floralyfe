import { 
    Vital, 
    User,
    Note,
    Plant,
    Notification
} from "../models";
const gql = String.raw;

const models = [
    Vital, User, Note, Plant, Notification
];

const streamedModels = [
    Vital, Notification
];

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
