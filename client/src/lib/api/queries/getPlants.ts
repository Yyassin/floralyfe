/**
 * createPlant.ts
 * 
 * The get plant query. 
 */

const gql = String.raw;
export const GET_PLANT = gql`
    query view_plant($ownerID: String!) {
        plants(ownerID: $ownerID) {
            id
            name
            species
            cameraAngle
            optima {
                humidity
                soilMoisture
                temperature
            }
            ownerID
        }
    }
`;