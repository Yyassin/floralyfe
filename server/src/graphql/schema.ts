const gql = String.raw;

const typeDefs = gql`
    scalar Date

    type Vital {
        id: ID!
        soilMoisture: Float!
        temperature: Float!
        airHumidity: Float!
        plantID: ID!
        createdAt: Date!
    }

    type Query {
        vitals: [Vital]
    }

    type Mutation {
        createVital(
            soilMoisture: Float!
            temperature: Float!
            airHumidity: Float!
            plantID: ID!
            deviceID: ID!
        ): Vital!
        updateVital(
            id: ID!
            soilMoisture: Float!
            temperature: Float!
            airHumidity: Float!
            plantID: ID!
            deviceID: ID!
        ): Boolean!
        deleteVital(id: ID!, deviceID: ID!): Boolean!
    }

    type Subscription {
        vital(deviceID: ID!): VitalSubscriptionPayload!
    }

    type VitalSubscriptionPayload {
        mutation: String!
        data: Vital!
    }
`;

export { typeDefs };
