import { db } from "../../firebaseConfig";
import { CollectionReference, DocumentData } from "@firebase/firestore-types";
import { Collections, ID } from "./common";

abstract class FirestoreDocument<T, A> {
    readonly #collection: Collections; // The collection being queried
    readonly #model: CollectionReference;

    constructor(collection: Collections) {
        this.#collection = collection;
        this.#model = db.collection(this.#collection);
    }

    public async create({ ...args }: A): Promise<T> {
        return (await this.#model.add({ ...args })) as unknown as T;
    }

    public async delete(id: ID): Promise<void> {
        await this.#model.doc(id).delete();
    }

    public async get(id: ID): Promise<T> {
        const snapshot = await this.#model.doc(id).get();
        return snapshot.data() as unknown as T;
    }

    public async getAll(): Promise<T[]> {
        const snapshot = await this.#model.get();
        return snapshot.docs.map((doc: DocumentData) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }

    public async update(id: ID, { ...args }: A): Promise<void> {
        await this.#model.doc(id).update({ ...args });
    }
}

export default FirestoreDocument;
