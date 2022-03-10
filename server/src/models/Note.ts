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

const query = gql`
    notes(plantID: ID!): [Note]
`;

class Note extends FirestoreDocument<INote, createNoteArgs> {
    constructor() {
        super(Collections.NOTES);
    }

    public async getByPlantID(plantID: string): Promise<INote[]> {
        const snapshot = await this.model.where("plantID", "==", plantID).get();
        return snapshot.docs.map((doc: DocumentData) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
};

const note = new Note();

const getNotesByPlantID = async (args: { plantID: string }) => {
    return await note.getByPlantID(args.plantID);
}

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

const updateNote = async (
    args: updateNoteArgs
): Promise<Boolean> => {
    const { id } = args;
    delete args["id"];

    args["updatedAt"] = new Date().toISOString();

    await note.update(id, args);

    return true;
}

const deleteNote = async (
    { id }: any
): Promise<Boolean> => {
    await note.delete(id);

    return true;
};

const queries = () => ({
    notes: (_, args) => getNotesByPlantID(args),
});

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
    query
}
