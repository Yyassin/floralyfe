/**
 * Plant.ts
 * 
 * The Plant model. Defines the Plant
 * type and associated resolvers.
 * @author Yousef 
 */

import { Collections, ID } from "./common";
import { DocumentData } from "@firebase/firestore-types";
import FirestoreDocument from "./FirestoreDocument";

interface Optima {
    temperature: number;
    humidity: number;
    light: number;
    soilMoisture: number;
}

interface IPlant {
    id: ID;
    name: string;
    species: string;
    camera_angle: number;
    optima: Optima;
    ownerID: ID;
}

type updatePlantArgs = Omit<IPlant, "OwnerID">;
type createPlantArgs = Omit<IPlant, "id">;

// The GraphQL Schema Type
const gql = String.raw;
const schemaType = gql`
    type Optima {
        temperature: Float
        soilMoisture: Float
        humidity: Float
    }

    input OptimaInput {
        temperature: Float
        soilMoisture: Float
        humidity: Float
    }

    type Plant {
        id: ID!
        name: String!
        species: String!
        cameraAngle: Float!
        optima: Optima!
        ownerID: ID!
    }
`;

// The GraphQL mutation interfaces
const mutation = gql`
    createPlant(
        name: String!
        species: String!
        cameraAngle: Float!
        optima: OptimaInput!
        ownerID: ID!
    ): Plant!

    updatePlant(
        id: ID!
        name: String
        species: String
        cameraAngle: Float
        optima: OptimaInput
    ): Boolean!

    deletePlant(id: ID!): Boolean!
`;

// The GraphQL query interfaces
const query = gql`
    plants(ownerID: String!): [Plant]
`;

/**
 * Plant model helper.
 */
class Plant extends FirestoreDocument<IPlant, createPlantArgs> {
    constructor() {
        super(Collections.PLANTS);
    }

    /**
     * Returns plants filtered by the specified ownerID.
     * @param ownerID string, the ownerID to filter by.
     * @returns Promise<IPlant[]>, the notes matching the specified owner id.
     */
    public async getByOwnerID(ownerID: string): Promise<IPlant[]> {
        const snapshot = await this.model.where("ownerID", "==", ownerID).get();
        return snapshot.docs.map((doc: DocumentData) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
};

const plant = new Plant();

/**
 * Returns the plants matching the specified ownerID.
 * @param args, the owner ID to filter with.
 * @returns Promise<IPlant[]>, the notes matching the specified owner id.
 */
const getPlantsByOwnerID = async (args: { ownerID: string }) => {
    return await plant.getByOwnerID(args.ownerID);
};

/**
 * Creates a plant with the specified parameters.
 * @param args, the information to create a plant with.
 * @returns Promise<IPlant[]>, the created plant.
 */
const createPlant = async (
    args: createPlantArgs
): Promise<IPlant> => {
    const { id } = await plant.create(args);

    const snapshot = {
        id,
        ...(await plant.get(id)),
    };

    return snapshot;
}

/**
 * Updates a plant with the specified parameters.
 * @param args, the information to update the plant with.
 * @returns Promise<IPlant[]>, the created plant.
 */
const updatePlant = async (
    args: updatePlantArgs
): Promise<Boolean> => {
    const { id } = args;
    delete args["id"];

    await plant.update(id, args);

    return true;
}

/**
 * Deletes the plant with the specified id.
 * @param args, the id of the plant to delete.
 * @returns Promise<Boolean>, returns true if deleted successfully.
 */
const deletePlant = async (
    { id }: any
): Promise<Boolean> => {
    await plant.delete(id);

    return true;
};

// All plant queries
const queries = () => ({
    plants: (_, args) => getPlantsByOwnerID(args),
});

// All plant mutations
const mutations = () => ({
    createPlant: (_, args) => createPlant(args),
    updatePlant: (_, args) => updatePlant(args),
    deletePlant: (_, args) => deletePlant(args),
});

export { 
    queries,
    mutations,
    plant,
    schemaType,
    mutation, 
    query,
    IPlant
}