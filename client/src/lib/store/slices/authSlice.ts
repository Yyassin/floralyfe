import { uuid } from "lib/components/util/util";
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
    user: User | null;
    isAuth: boolean;
    registeredUsers: Record<string, User>;
    addRegisteredUser: (user: User) => void;
    setIsAuth: (isAuth: boolean) => void;
    setUser: (user: User | null) => void
}

const addRegisteredUser = (users: Record<string, User>, user: User) => {
    return ({
        ...users,
        [user.id]: user
    })
};

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