/**
 * Global application store.
 */

import create from "zustand";
import { persist } from "zustand/middleware"
import { createUserSlice, UserSlice } from "./slices/authSlice";

import { NoteSlice, createNoteSlice, Note } from "./slices/notesSlice";
import { createNotificationSlice, NotificationSlice } from "./slices/notificationsSlices";
import { createPlantSlice, PlantSlice } from "./slices/plantSlice";
import { createVitalSlice, VitalSlice } from "./slices/vitalSlice";

export type StoreState = (
    VitalSlice &
    NotificationSlice &
    PlantSlice &
    UserSlice &
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
const useStore = create<StoreState>(persist((set, get) => ({
    ...createNoteSlice(set, get),
    ...createUserSlice(set, get),
    ...createPlantSlice(set, get),
    ...createNotificationSlice(set, get),
    ...createVitalSlice(set, get),
    cameraEncoded: "",
    selectedPlantID: "",
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
}), {
    name: "app-storage",               // unique name
    // getStorage: () => sessionStorage, // (optional) by default, 'localStorage' is used
}
));

export { useStore };
