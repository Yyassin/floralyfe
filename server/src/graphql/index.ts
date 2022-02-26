import { createServer } from "@graphql-yoga/node";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const gqlServer = () => {
    return createServer({
        schema: {
            typeDefs, 
            resolvers
        }
    })
};

export { gqlServer };
