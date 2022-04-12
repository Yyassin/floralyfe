/**
 * Note.ts
 * 
 * The Note model. Defines the Note
 * type and associated resolvers.
 * @author Yousef 
 */

import { Collections, ID } from "./common";
import { DocumentData } from "@firebase/firestore-types";
import FirestoreDocument from "./FirestoreDocument";

interface INote {
    id: ID;
    title: string;
    text: string;
    plantID: string;
    updatedAt: string;
};

type updateNoteArgs = Omit<INote, "updatedAt">;
type createNoteArgs = Omit<INote, "id" | "updatedAt">;

// The GraphQL Schema Type
const gql = String.raw;
const schemaType = gql`
    type Note {
        id: ID!
        title: String!
        text: String!
        plantID: ID!
        updatedAt: Date!
    }
`;

// The GraphQL mutation interfaces
const mutation = gql`
    createNote(
        title: String!
        text: String!
        plantID: String!
    ): Note!

    updateNote(
        id: ID!
        title: String
        text: String
    ): Boolean!

    deleteNote(id: ID!): Boolean!
`;

// The GraphQL query interfaces
const query = gql`
    notes(plantID: ID!): [Note]
`;

/**
 * Note model helper.
 */
class Note extends FirestoreDocument<INote, createNoteArgs> {
    constructor() {
        super(Collections.NOTES);
    }

    /**
     * Returns notes filtered by the specified plantID.
     * @param plantID string, the plantID to filter by.
     * @returns Promise<INote[]>, the notes matching the specified plant id.
     */
    public async getByPlantID(plantID: string): Promise<INote[]> {
        const snapshot = await this.model.where("plantID", "==", plantID).get();
        return snapshot.docs.map((doc: DocumentData) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
};

const note = new Note();

/**
 * Returns the notes matching the specified plantID.
 * @param args, the plant ID to filter with.
 * @returns Promise<INote[]>, the notes matching the specified plant id.
 */
const getNotesByPlantID = async (args: { plantID: string }) => {
    return await note.getByPlantID(args.plantID);
}

/**
 * Creates a note with the specified parameters.
 * @param args, the information to create a note with.
 * @returns Promise<INote[]>, the created note.
 */
const createNote = async (
    args: createNoteArgs
): Promise<INote> => {
    args["updatedAt"] = new Date().toISOString();

    const { id } = await note.create(args);

    const snapshot = {
        id,
        ...(await note.get(id)),
    };

    return snapshot;
}

/**
 * Updates a note with the specified parameters.
 * @param args, the information to update the note with.
 * @returns Promise<INote[]>, the created note.
 */
const updateNote = async (
    args: updateNoteArgs
): Promise<Boolean> => {
    const { id } = args;
    delete args["id"];

    args["updatedAt"] = new Date().toISOString();

    await note.update(id, args);

    return true;
}

/**
 * Deletes the note with the specified id.
 * @param args, the id of the note to delete.
 * @returns Promise<Boolean>, returns true if deleted successfully.
 */
const deleteNote = async (
    { id }: any
): Promise<Boolean> => {
    await note.delete(id);

    return true;
};

// All note queries
const queries = () => ({
    notes: (_, args) => getNotesByPlantID(args),
});

// All note mutations
const mutations = () => ({
    createNote: (_, args) => createNote(args),
    updateNote: (_, args) => updateNote(args),
    deleteNote: (_, args) => deleteNote(args),
});

export { 
    queries,
    mutations,
    note,
    schemaType,
    mutation, 
    query,
    INote
}
