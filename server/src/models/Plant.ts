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

const query = gql`
    plants(ownerID: String!): [Plant]
`;

class Plant extends FirestoreDocument<IPlant, createPlantArgs> {
    constructor() {
        super(Collections.PLANTS);
    }

    public async getByOwnerID(ownerID: string): Promise<IPlant[]> {
        const snapshot = await this.model.where("ownerID", "==", ownerID).get();
        return snapshot.docs.map((doc: DocumentData) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
};

const plant = new Plant();

const getPlantsByOwnerID = async (args: { ownerID: string }) => {
    return await plant.getByOwnerID(args.ownerID);
};

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

const updatePlant = async (
    args: updatePlantArgs
): Promise<Boolean> => {
    const { id } = args;
    delete args["id"];

    await plant.update(id, args);

    return true;
}

const deletePlant = async (
    { id }: any
): Promise<Boolean> => {
    await plant.delete(id);

    return true;
};

const queries = () => ({
    plants: (_, args) => getPlantsByOwnerID(args),
});

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