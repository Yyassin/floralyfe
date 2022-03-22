/**
 * Global application store.
 */

import { StringDecoder } from "string_decoder";
import create from "zustand";

import { NoteSlice, createNoteSlice, Note } from "./slices/notesSlice";

export type StoreState = (
    NoteSlice &
    Store
)

// Define store structure
type Store = {
    cameraEncoded: string;                                      // Base64 encoded camera feed frame
    selectedPlantID: string;
    setCameraEncoded: (encoded: string) => void;                // Setter
    setSelectedPlantID: (id: string) => void;
    
};

// Creates the store and associated actions.
// Exposes the store through a hook.
const useStore = create<StoreState>((set, get) => ({
    ...createNoteSlice(set, get),
    cameraEncoded: "",
    selectedPlantID: "aloe",
    setCameraEncoded(text: string) {
        set((state) => ({
            ...state,
            cameraEncoded: text,
        }));
    },
    setSelectedPlantID(id: string) {
        set((state) => ({
            ...state,
            selectedPlantID: id,
        }));
    },
}));

export { useStore };
