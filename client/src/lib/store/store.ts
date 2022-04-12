/**
 * store.ts
 * 
 * Global application store for managing state.
 * @author Yousef
 */

import create from "zustand";
import { devtools, persist } from "zustand/middleware"
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
    selectedPlantID: string;                                    // Selected plant's id.
    senseIcon: string;                                          // The current SenseHat Icon
    setCameraEncoded: (encoded: string) => void;                // Camera base64 encoded setter
    setSelectedPlantID: (id: string) => void;                   // Plant id setter
    setSenseIcon: (icon: string) => void;                       // SenseHat icon setter
};

// Creates the store and associated actions.
// Joins store slices.Exposes the store through a hook.
const useStore = create<StoreState>(devtools(persist((set, get) => ({
    ...createNoteSlice(set, get),
    ...createUserSlice(set, get),
    ...createPlantSlice(set, get),
    ...createNotificationSlice(set, get),
    ...createVitalSlice(set, get),
    cameraEncoded: "",
    senseIcon: "HAPPY",
    selectedPlantID: "",
    setCameraEncoded(text: string) {    // Sets base 64 encoded live stream frame
        set((state) => ({
            ...state,
            cameraEncoded: text,
        }));
    },
    setSelectedPlantID(id: string) {    // Sets the selected plant id
        set((state) => ({
            ...state,
            selectedPlantID: id,
        }));
    },
    setSenseIcon(icon: string) {        // Sets the sense icon
        set((state) => ({
            ...state,
            senseIcon: icon,
        }));
    }
}), {
    name: "app-storage",               // unique name
    // getStorage: () => sessionStorage, // (optional) by default, 'localStorage' is used
}
)));

export { useStore };
