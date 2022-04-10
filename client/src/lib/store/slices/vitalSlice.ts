import { uuid } from "lib/components/util/util";
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
    vitals: {
        [id: string]: {
            live: Vital;
            persisted: Vital[]
        }
    },
    channelTelemetry: any,
    setLiveVital: (vital: Vital) => void;
    addPersistedVital: (vital: Vital) => void;
    setChannelTelemetry: (vital: any) => void;
    loadVitals: (plantID: string, vitals: Vital[]) => void;
}

const addPersistedVital = (vitals: Vital[], vital: Vital) => {
    return ([
        ...vitals,
        vital
    ])
}

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