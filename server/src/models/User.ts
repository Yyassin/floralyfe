import { Collections, ID } from "./common";
import { DocumentData } from "@firebase/firestore-types";
import FirestoreDocument from "./FirestoreDocument";

interface IUser {
    id: ID;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
    subscribedNotifications: boolean;
    deviceID: string;
    createdAt: string;
    updatedAt: string;
}

type updateUserArgs = Omit<IUser, "createdAt | updatedAt | deviceID">;
type createUserArgs = Omit<IUser, "id" | "createdAt" | "updatedAt">;

const gql = String.raw;
const schemaType = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        username: String!
        email: String!
        password: String!
        avatar: String
        subscribedNotifications: Boolean!
        deviceID: String
        createdAt: Date!
        updatedAt: Date!
    }

    type Token {
        token: String!
    }

    type Response {
        response: String!
    }
`;

const mutation = gql`
    createUser(
        firstName: String!
        lastName: String!
        username: String!
        email: String!
        password: String!
    ): User!

    updateUser(
        id: ID!
        firstName: String
        lastName: String
        username: String
        email: String
        password: String
        avatar: String
        subscribedNotifications: Boolean
        deviceID: String
    ): Boolean!

    deleteUser(id: ID!): Boolean!
`;

const query = gql`
    users(email: String!, password: String!): User

    signIn(username: String!, password: String!): Token!

    signOut(token: String!): Response!

`;

class User extends FirestoreDocument<IUser, createUserArgs> {
    constructor() {
        super(Collections.USERS);
    }

    public async getByEmail(email: string): Promise<IUser[]> {
        const snapshot = await this.model.where("email", "==", email).get();
        return snapshot.docs.map((doc: DocumentData) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
}

const user = new User();

const getUserByLogin = async (args: { email: string, password: string }) => {
    const fetchedUser = await user.getByEmail(args.email);

    if (fetchedUser.length === 0) {
        return null;
    }

    if (args.password !== fetchedUser[0].password) {
        return null
    }

    return fetchedUser[0]
}

const signIn = async (args: { username: string, password: string}) => {
    return { token: `test_token: got u-${args.username} p-${args.password}` };
}

const signOut = async (args: { token: string}) => {
    return { response: `signed out: got tok-${args.token}` };
}

const createUser = async (
    args: createUserArgs
): Promise<IUser> => {
    const now = new Date().toISOString();

    args["createdAt"] = now;
    args["updatedAt"] = now;
    args["subscribedNotifications"] = true;

    const { id } = await user.create(args);

    const snapshot = {
        id,
        ...(await user.get(id)),
    };

    return snapshot;
}

const updateUser = async (
    args: updateUserArgs
): Promise<Boolean> => {
    const { id } = args;
    delete args["id"];

    args["updatedAt"] = new Date().toISOString();

    await user.update(id, args);

    return true;
}

const deleteUser = async (
    { id }: any
): Promise<Boolean> => {
    await user.delete(id);

    return true;
};

const queries = () => ({
    users: (_, args) => getUserByLogin(args),
    signIn: (_, args) => signIn(args),
    signOut: (_, args) => signOut(args),
});

const mutations = () => ({
    createUser: (_, args) => createUser(args),
    updateUser: (_, args) => updateUser(args),
    deleteUser: (_, args) => deleteUser(args),
});

export { 
    queries,
    mutations,
    user,
    schemaType,
    mutation, 
    query,
    IUser
}