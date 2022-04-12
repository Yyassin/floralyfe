/**
 * createPlant.ts
 * 
 * The create plant query. 
 */

const gql = String.raw;

export const CREATE_PLANT = gql`
    mutation create_plant ($name: String!,
                            $species: String!,
                            $cameraAngle: Float!,
                            $optima: OptimaInput!,
                            $ownerID: ID!){
        createPlant(name: $name,
                    species: $species,
                    cameraAngle: $cameraAngle,
                    optima: $optima,
                    ownerID: $ownerID){
            id
            name
            species
            cameraAngle
            optima{
                temperature
                soilMoisture
                humidity
            }
            ownerID
        }
    }
`