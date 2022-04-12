/**
 * storeSlice.ts
 * 
 * Store slice type to partition
 * the Zustand store. 
 */

import { GetState, SetState } from "zustand";
import { StoreState } from "./store";

export type StoreSlice<T> = (
    set: SetState<StoreState>,
    get: GetState<StoreState>
) => T;