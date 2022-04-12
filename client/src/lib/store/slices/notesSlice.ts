/**
 * notesSlice.ts
 * 
 * Manages state for plant notes
 * @author Yousef
 */

import { uuid } from "lib/components/util/util";
import { StoreState } from "../store";
import { StoreSlice } from "../storeSlice";

export interface Note {
    id: string;
    title: string;
    text: string;
    done: boolean;
}

export type NoteSlice = {
    notes: Record<string, Note[]>;                          // All fetched notes
    newNote: { text: string, title: string };               // New note persist
    updateNote: (id: string, text: string) => void;         // Updates the note with the specified id
    toggleNote: (id: string) => void;                       // Toggle check status of specified note
    removeNote: (id: string) => void;                       // Removes the specified note
    setNewNote: (text?: string, title?: string) => void;    // Mutates new note
    addNote: () => void;                                    // Adds new note to notes.
}

/**
 * Updates the note with the specified id with the specified text.
 * @param notes Note[], currently fetched note collection.
 * @param id string, id of note to update.
 * @param text string, text to update note with.
 * @returns Note[], updated note state.
 */
const updateNote = (notes: Note[], id: string, text: string): Note[] =>
    notes.map(note => ({
        ...note,
        text: note.id === id ? text: note.text,
    }));

/**
 * Toggles check state of note with specified id.
 * @param notes Note[], current note state.
 * @param id string, id of note to toggle.
 * @returns Note[], updated note state.
 */
const toggleNote = (notes: Note[], id: string): Note[] =>
    notes.map(note => ({
        ...note,
        done: note.id === id ? !note.done : note.done
    }));

/**
 * Removes the note with the specified id.
 * @param notes Note[], current note state.
 * @param id string, id of note to remove.
 * @returns Note[], updated note state.
 */
const removeNote = (notes: Note[], id: string): Note[] => 
    notes.filter(note => note.id !== id);

/**
 * Adds a note to state with the specified text and title.
 * @param notes Note[], current note state.
 * @param text string, the note to add's text.
 * @param title string, the note to add's title.
 * @returns Note[], updated note state.
 */
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

/**
 * Creates a note store slice.
 * @param set, sets the store state.
 * @param get, reads the store state.
 * @returns the store slice.
 */
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
