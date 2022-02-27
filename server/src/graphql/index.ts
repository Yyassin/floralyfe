import { GraphQLServer } from "graphql-yoga";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const gqlServer = () => {
    return new GraphQLServer({ typeDefs, resolvers });
};

export { gqlServer };
