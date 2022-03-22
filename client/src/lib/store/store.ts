/**
 * Global application store.
 */

import Notes from "lib/components/components/Note/Notes";
import { StringDecoder } from "string_decoder";
import create from "zustand";

const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
    });
 }

export interface Note {
    id: string;
    title: string;
    text: string;
    done: boolean;
}

const updateNote = (notes: Note[], id: string, text: string): Note[] =>
    notes.map(note => ({
        ...note,
        text: note.id === id ? text: note.text,
    }));

const toggleNote = (notes: Note[], id: string): Note[] =>
    notes.map(note => ({
        ...note,
        done: note.id === id ? !note.done : note.done
    }));

const removeNote = (notes: Note[], id: string): Note[] => 
    notes.filter(note => note.id !== id);

const addNote = (notes: Note[], text: string, title: string): Note[] => {
    if (text === "") return notes;
    return [
        ...notes,
        {
            id: uuid(),
            title,
            text,
            done: false
        }
    ]
}

// Define store structure
type Store = {
    cameraEncoded: string;                          // Base64 encoded camera feed frame
    selectedPlantID: string;
    notes: Record<string, Note[]>;
    newNote: { text: string, title: string };
    setCameraEncoded: (encoded: string) => void;    // Setter
    setSelectedPlantID: (id: string) => void;
    updateNote: (id: string, text: string) => void;
    toggleNote: (id: string) => void;
    removeNote: (id: string) => void;
    setNewNote: (text?: string, title?: string) => void;
    addNote: () => void;
};

// Creates the store and associated actions.
// Exposes the store through a hook.
const useStore = create<Store>((set) => ({
    cameraEncoded: "",
    notes: {} as Record<string, Note[]>,
    newNote: {
        text: "",
        title: ""
    },
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
    removeNote: (id: string) => 
        set((state) => ({
            ...state,
            notes: {
                ...state.notes,
                [state.selectedPlantID]: removeNote(state.notes[state.selectedPlantID] || [], id)
            }
        })),
    updateNote: (id: string, text: string) => 
        set((state) => ({
            ...state,
            notes: {
                ...state.notes,
                [state.selectedPlantID]: updateNote(state.notes[state.selectedPlantID] || [], id, text)
            }
        })),
    toggleNote: (id: string) => 
        set((state) => ({
            ...state,
            notes: {
                ...state.notes,
                [state.selectedPlantID]: toggleNote(state.notes[state.selectedPlantID] || [], id)
            }
        })),
    setNewNote: (text?: string, title?: string) => {
        set((state) => {
            text = text || state.newNote.text;
            title = title || state.newNote.title;

            return {
                ...state,
                newNote: {
                    text,
                    title
                }
            }
        });
    },
    addNote: () => 
        set((state) => ({
            ...state,
            notes: {
                ...state.notes,
                [state.selectedPlantID]: addNote(state.notes[state.selectedPlantID] || [], state.newNote.text, state.newNote.title)
            },
            newNote: {
                text: "",
                title: ""
            }
        }))
}));

export { useStore };
