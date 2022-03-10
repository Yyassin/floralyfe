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
`;

const query = gql`
    users(username: String!): [User]
`;

class User extends FirestoreDocument<IUser, createUserArgs> {
    constructor() {
        super(Collections.USERS);
    }

    public async getByUsername(username: string): Promise<IUser[]> {
        const snapshot = await this.model.where("username", "==", username).get();
        return snapshot.docs.map((doc: DocumentData) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
}

const user = new User();

const getUserByUsername = async (args: { username: string }) => {
    return await user.getByUsername(args.username);
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

const queries = () => ({
    users: (_, args) => getUserByUsername(args),
});

const mutations = () => ({
    createUser: (_, args) => createUser(args),
    updateUser: (_, args) => updateUser(args),
});

export { 
    queries,
    mutations,
    user,
    schemaType,
    mutation, 
    query
}