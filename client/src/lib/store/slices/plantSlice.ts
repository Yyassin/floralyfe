/**
 * plantSlice.ts
 * 
 * Manages state for plants
 * @author Yousef
 */

import { clamp } from "lib/components/util/util";
import { StoreState } from "../store";
import { StoreSlice } from "../storeSlice";

export interface Plant {
    id: string;
    name: string;
    species: string;
    angle: number;
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
    plants: Record<string, Plant>,      // Registered plants
    angle: number,                      // Servo camera angle
    addPlant: (plant: Plant) => void    // Adds a registered plant
    resetPlants: () => void,            // Clears all registered plants
    setAngle: (angle: number) => void;  // Sets the servo angle.
}

/**
 * Adds a registered plant to state.
 * @param plants Record<string, Plant>, the current plant state.
 * @param plant Plant, the plant to add.
 * @returns Record<string, Plant>, the updated plant state.
 */
const addPlant = (plants: Record<string, Plant>, plant: Plant) => {
    if (Object.keys(plants).length >= 2) return plants;
    // @ts-ignore
    plant.angle = plant.cameraAngle; 
    return {
        ...plants,
        [plant.id]: {
            ...plant,
            wiki: plant.wiki ? plant.wiki : "https://en.wikipedia.org/wiki/Plant",
            description: plant.description ? plant.description : "Plants are predominantly photosynthetic eukaryotes of the kingdom Plantae. Historically, the plant kingdom encompassed all living things that were not animals, and included algae and fungi; however, all current definitions of Plantae exclude the fungi and some algae, as well as the prokaryotes (the archaea and bacteria). By one definition, plants form the clade Viridiplantae (Latin name for green plants), a group that includes the flowering plants, conifers and other gymnosperms, ferns and their allies, hornworts, liverworts, mosses, and the green algae, but excludes the red and brown algae."
        }
    }
}

/**
 * Creates a plant store slice.
 * @param set, sets the store state.
 * @param get, reads the store state.
 * @returns the store slice.
 */
export const createPlantSlice: StoreSlice<PlantSlice> = (set, get) => ({
    plants: {},
    angle: 90,
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
    setAngle: (angle: number) => set((state: StoreState) => ({
        ...state,
        angle: clamp(angle, 1, 179)
    }))
})