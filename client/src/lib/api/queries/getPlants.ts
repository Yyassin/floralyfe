export const GET_PLANT = `
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