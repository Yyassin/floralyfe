/**
 * Global application store.
 */

import create from "zustand";

// Store Implementation

// Define store structure
type Store = {
    cameraEncoded: string; // Base64 encoded camera feed frame
    setCameraEncoded: (encoded: string) => void; // Setter
};

// Creates the store and associated actions.
// Exposes the store through a hook.
const useStore = create<Store>((set) => ({
    cameraEncoded: "",
    setCameraEncoded(text: string) {
        set((state) => ({
            ...state,
            cameraEncoded: text,
        }));
    },
}));

export { useStore };
