import { GetState, SetState } from "zustand";
import { StoreState } from "./store";

export type StoreSlice<T> = (
    set: SetState<StoreState>,
    get: GetState<StoreState>
) => T;