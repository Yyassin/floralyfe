import { gql } from "apollo-server-express";

const typeDefs = gql`
    type User {
        name: String
        email: String
        projects: [Project]
    }

    type Project {
        title: String!
        active: Boolean!
        members: [User!]!
    }

    type Query {
        users: [User]
    }

    type Mutation {
        createUser(name: String!): User!
    }

    type Subscription {
        user: UserSubscriptionPayload!
    }

    type UserSubscriptionPayload {
        mutation: String!
        data: User!
    }
`;

export { typeDefs }