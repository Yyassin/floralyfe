import { uuid } from "lib/components/util/uuid";
import { StoreState } from "../store";
import { StoreSlice } from "../storeSlice";

export interface Note {
    id: string;
    title: string;
    text: string;
    done: boolean;
}

export type NoteSlice = {
    notes: Record<string, Note[]>;
    newNote: { text: string, title: string };
    updateNote: (id: string, text: string) => void;
    toggleNote: (id: string) => void;
    removeNote: (id: string) => void;
    setNewNote: (text?: string, title?: string) => void;
    addNote: () => void;
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

export const createNoteSlice: StoreSlice<NoteSlice> = (set, get) => ({
    notes: {} as Record<string, Note[]>,
    newNote: {
        text: "",
        title: ""
    },
    removeNote: (id: string) => 
        set((state: StoreState) => ({
            ...state,
            notes: {
                ...state.notes,
                [state.selectedPlantID]: removeNote(state.notes[state.selectedPlantID] || [], id)
            }
        })),
    updateNote: (id: string, text: string) => 
        set((state: StoreState) => ({
            ...state,
            notes: {
                ...state.notes,
                [state.selectedPlantID]: updateNote(state.notes[state.selectedPlantID] || [], id, text)
            }
        })),
    toggleNote: (id: string) => 
        set((state: StoreState) => ({
            ...state,
            notes: {
                ...state.notes,
                [state.selectedPlantID]: toggleNote(state.notes[state.selectedPlantID] || [], id)
            }
        })),
    setNewNote: (text?: string, title?: string) => {
        set((state: StoreState) => {
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
        set((state: StoreState) => ({
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
})
