/**
 * User.ts
 * 
 * The User model. Defines the User
 * type and associated resolvers.
 * @author Yousef 
 */

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

// The GraphQL Schema Type
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

// The GraphQL mutation interfaces
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

// The GraphQL query interfaces
const query = gql`
    users(email: String!, password: String!): User

    signIn(username: String!, password: String!): Token!

    signOut(token: String!): Response!

`;

/**
 * User model helper.
 */
class User extends FirestoreDocument<IUser, createUserArgs> {
    constructor() {
        super(Collections.USERS);
    }

    /**
     * Returns users filtered by the specified email.
     * @param email string, the email to filter by.
     * @returns Promise<IUser[]>, the notes matching the specified email.
     */
    public async getByEmail(email: string): Promise<IUser[]> {
        const snapshot = await this.model.where("email", "==", email).get();
        return snapshot.docs.map((doc: DocumentData) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
}

const user = new User();

/**
 * Returns the user matching the specified email and 
 * validates that password matches that user.
 * @param args, the email to filter with.
 * @returns Promise<IUser[] | null>, the user matching the specified
 *          email and password or null if none match.
 */
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

// Mock sign-in: replaced by getUserByLogin since no direct auth server side.
const signIn = async (args: { username: string, password: string}) => {
    return { token: `test_token: got u-${args.username} p-${args.password}` };
}

// Mock sign-out: not needed since no server side auth.
const signOut = async (args: { token: string}) => {
    return { response: `signed out: got tok-${args.token}` };
}

/**
 * Creates a user with the specified parameters.
 * @param args, the information to create a user with.
 * @returns Promise<IUser[]>, the created user.
 */
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

/**
 * Updates a user with the specified parameters.
 * @param args, the information to update the user with.
 * @returns Promise<IUser[]>, the created user.
 */
const updateUser = async (
    args: updateUserArgs
): Promise<Boolean> => {
    const { id } = args;
    delete args["id"];

    args["updatedAt"] = new Date().toISOString();

    await user.update(id, args);

    return true;
}

/**
 * Deletes the user with the specified id.
 * @param args, the id of the user to delete.
 * @returns Promise<Boolean>, returns true if deleted successfully.
 */
const deleteUser = async (
    { id }: any
): Promise<Boolean> => {
    await user.delete(id);

    return true;
};

// All user queries
const queries = () => ({
    users: (_, args) => getUserByLogin(args),
    signIn: (_, args) => signIn(args),
    signOut: (_, args) => signOut(args),
});

// All user mutations
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