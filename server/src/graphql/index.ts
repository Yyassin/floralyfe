/**
 *  index.ts
 * 
 *  Joins type definitions and resolvers
 *  into single GraphQL server instance.
 *  @author Yousef
 */

import { GraphQLServer } from "graphql-yoga";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

/**
 * Joins typedefs and resolvers into
 * GraphQL server.
 * @returns GraphQLServer, the server.
 */
const gqlServer = () => {
    return new GraphQLServer({ typeDefs, resolvers });
};

export { gqlServer };
