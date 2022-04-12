/**
 * authSlice.ts
 * 
 * Authentication slice for managing
 * logged in user state. 
 * @author Yousef
 */

import { StoreState } from "../store";
import { StoreSlice } from "../storeSlice";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    deviceID: string | null;
};

export type UserSlice = {
    user: User | null;                          // The logged in user.
    isAuth: boolean;                            // True if authenticated, false otherwise.
    registeredUsers: Record<string, User>;      // Record of registered users (for testing only)
    addRegisteredUser: (user: User) => void;    // Adds a user to the registered user record.
    setIsAuth: (isAuth: boolean) => void;       // Sets this client's auth state.
    setUser: (user: User | null) => void        // Sets this client's logged in user.
}

/**
 * Adds the specified user to registered users.
 * @param users, current state of ids to users.
 * @param user, the user to add.
 * @returns the update user record.
 */
const addRegisteredUser = (users: Record<string, User>, user: User) => {
    return ({
        ...users,
        [user.id]: user
    })
};

/**
 * Creates a user store slice.
 * @param set, sets the store state.
 * @param get, reads the store state.
 * @returns the store slice.
 */
export const createUserSlice: StoreSlice<UserSlice> = (set, get) => ({
    user: null,
    isAuth: false,
    registeredUsers: {},
    addRegisteredUser: (user: User) => set((state: StoreState) => ({
        ...state,
        registeredUsers: addRegisteredUser(state.registeredUsers, user)
    })),
    setIsAuth: (isAuth: boolean) => 
        set((state: StoreState) => ({
            ...state,
            isAuth
        })),
    setUser: (user: User | null) => 
        set((state: StoreState) => ({
            ...state,
            user
        }))
})