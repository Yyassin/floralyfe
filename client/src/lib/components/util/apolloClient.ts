import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    ApolloProvider,
    split,
  } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/link-ws";

const httpLink = new HttpLink({
    uri: "http://c92f-174-112-246-246.ngrok.io/graphql",
});

const wsLink = process.browser
    ? new WebSocketLink({
        uri: "ws://c92f-174-112-246-246.ngrok.io/subscriptions",
        options: {
            reconnect: true,
            reconnectionAttempts: 3
        }
    })
    : null;

const splitLink = wsLink !== null 
    ? split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            console.log(query)
            return(
                definition.kind === "OperationDefinition" &&
                definition.operation === "subscription"
            );
        },
        wsLink,    // Won't be null if process.brow
        httpLink
    )
    : httpLink;

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink
});

export { client }