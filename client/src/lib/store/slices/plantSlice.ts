import { uuid } from "lib/components/util/uuid";
import { StoreState } from "../store";
import { StoreSlice } from "../storeSlice";

export interface Plant {
    id: string;
    name: string;
    species: string;
    channel: number;
    description: string;
    optima: {
        soilMoisture: number;
        temperature: number;
        humidity: number;
    }
    wiki: string;
    image: string;
};

export type PlantSlice = {
    plants: Record<string, Plant>,
    angle: number,
    addPlant: (plant: Plant) => void
    resetPlants: () => void,
    offsetAngle: (offset: number) => void;
}

const addPlant = (plants: Record<string, Plant>, plant: Plant) => {
    if (Object.keys(plants).length >= 2) return plants;
    return {
        ...plants,
        [plant.id]: plant
    }
}

export const createPlantSlice: StoreSlice<PlantSlice> = (set, get) => ({
    plants: {},
    angle: 0,
    addPlant: (plant: Plant) => 
    set((state: StoreState) => ({
        ...state,
        selectedPlantID: state.selectedPlantID == "" ? plant.id : state.selectedPlantID,
        plants: addPlant(state.plants, plant)
    })),
    resetPlants: () => set((state: StoreState) => ({
        ...state,
        plants: {}
    })),
    offsetAngle: (offset: number) => set((state: StoreState) => ({
        ...state,
        angle: state.angle + offset
    }))
})