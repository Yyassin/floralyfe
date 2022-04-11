/**
 * FirestoreDocument.ts
 * 
 * General database model helper to interface
 * with Firestore accessors and mutators.
 * @author Yousef
 */

import { db } from "../../firebaseConfig";
import { CollectionReference, DocumentData } from "@firebase/firestore-types";
import { Collections, ID } from "./common";

abstract class FirestoreDocument<T, A> {
    /**
     * General database model helper to interface
     * with Firestore accessors and mutators.
     * 
     * T = Interface type
     * A = Interface creation arguments type
     */
    readonly #collection: Collections;              // The collection being queried
    protected readonly model: CollectionReference;  // The collection database model reference.

    /**
     * Creates a new FirestoreDocument.
     */
    constructor(collection: Collections) {
        this.#collection = collection;
        this.model = db.collection(this.#collection);
    }

    /**
     * Commits a new instance of this model
     * to the database with the specified arguments.
     * 
     * @param args A, the creation arguments.
     * @returns Promise<T>, the created instance.
     */
    public async create({ ...args }: A): Promise<T> {
        return (await this.model.add({ ...args })) as unknown as T;
    }

    /**
     * Deletes the instance in this document's
     * collection matching the specified id.
     * @param id ID, the id of the instance to delete.
     */
    public async delete(id: ID): Promise<void> {
        await this.model.doc(id).delete();
    }

    /**
     * Fetches the instance in this document's 
     * collection matching the specified id.
     * @param id ID, the id of the instance to fetch.
     * @returns Promise<T>, the fetched instance.
     */
    public async get(id: ID): Promise<T> {
        const snapshot = await this.model.doc(id).get();
        return snapshot.data() as unknown as T;
    }

    /**
     * Returns all instances stored in this
     * document's collection.
     * @returns Promise<T[]>, all the instances in this 
     *          document's collection.
     */
    public async getAll(): Promise<T[]> {
        const snapshot = await this.model.get();
        return snapshot.docs.map((doc: DocumentData) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }

    /**
     * Updates the instance in this document's
     * collection matching the specified id with the
     * specified data.
     * @param id ID, the id of the instance to update.
     * @param args A, the arguments to update the instance with.
     */
    public async update(id: ID, { ...args }: A): Promise<void> {
        await this.model.doc(id).update({ ...args });
    }
}

export default FirestoreDocument;
