/**
 * vitalSlice.ts
 * 
 * Manages state for plant vitals
 * @author Yousef
 */

import { StoreState } from "../store";
import { StoreSlice } from "../storeSlice";

export interface Vital {
    id: string;
    plantID: string;
    critical: boolean;
    temperature: number;
    airHumidity: number;
    soilMoisture: number;
    light: number;
    greenGrowth: number;
    date: string;
}

export type VitalSlice = {
    vitals: {                       // Vitals, organized by plant id: each has one live and collection of persisted.
        [id: string]: {
            live: Vital;
            persisted: Vital[]
        }
    },
    channelTelemetry: any,          // Currently received channel telemetry vital (during registration)
    setLiveVital: (vital: Vital) => void;                       // Sets live vital
    addPersistedVital: (vital: Vital) => void;                  // Adds persisted vital
    setChannelTelemetry: (vital: any) => void;                  // Sets channel telemetry
    loadVitals: (plantID: string, vitals: Vital[]) => void;     // Loads multiple vitals
}

/**
 * Adds a persisted vital
 * @param vitals Vital[], the vital state.
 * @param vital Vital, the vital to add.
 * @returns Vital[], the updated vital state.
 */
const addPersistedVital = (vitals: Vital[], vital: Vital) => {
    return ([
        ...vitals,
        vital
    ])
}

/**
 * Creates a vital store slice.
 * @param set, sets the store state.
 * @param get, reads the store state.
 * @returns the store slice.
 */
export const createVitalSlice: StoreSlice<VitalSlice> = (set, get) => ({
    vitals: {},
    channelTelemetry: {},
    setLiveVital: (vital: Vital) => {
        if (!vital) return;
        
        set((state: StoreState) => ({
            ...state,
            vitals: {
                ...state.vitals,
                [vital.plantID]: {
                    ...state.vitals[vital.plantID], 
                    live: vital
                }
            }
        }))
    },
    setChannelTelemetry: (vital: any) =>
        set((state: StoreState) => ({
            ...state,
            channelTelemetry: vital
        })),
    addPersistedVital: (vital: Vital) => 
        set((state: StoreState) => ({
            ...state,
            vitals: {
                ...state.vitals,
                [vital.plantID]: {
                    ...state.vitals[vital.plantID], 
                    persisted: addPersistedVital(state.vitals[vital.plantID]?.persisted || [], vital)
                }
            }
        })),
    loadVitals: (plantID: string, vitals: Vital[]) =>
    set((state: StoreState) => ({
        ...state,
        vitals: {
            ...state.vitals,
            [plantID]: {
                ...state.vitals[plantID], 
                persisted: vitals
            }
        }
    })),
})