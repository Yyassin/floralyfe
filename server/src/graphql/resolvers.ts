import { users } from "./mock";
import { User } from "../../firebaseConfig";
import { PubSub } from "graphql-yoga";

const pubsub = new PubSub();

const snapshotToArray = (snapshot) => 
    snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

const getAllUsers = async () => {
    return snapshotToArray(await User.get());
}

const createUser = async (args) => {
    console.log(args);

    console.log(pubsub)

    pubsub.publish('user', {
        user: {
            mutation: 'CREATED',
            data: { ...args }
        }
    }); 

    return { ...args };
}

const resolvers = {
    Query: {
        users: () => getAllUsers(),
    },
    Mutation: {
        createUser: (root, args) => createUser(args),
    },
    Subscription: {
        user: {
            subscribe: () => {
                console.log("called")
                return pubsub.asyncIterator("user")
            },
        }
    }
};

export { resolvers };
