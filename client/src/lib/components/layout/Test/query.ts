import { gql } from "@apollo/client";

export const GET_VITALS = gql`
    query {
        vitals(plantID: "plantid1") {
            id
            soilMoisture
            temperature
            airHumidity
            light
            greenGrowth
            plantID
            createdAt
        }
    }
`;

export const GET_VITALS_STRING = `
    query {
        vitals(plantID: "plantid1") {
            id
            soilMoisture
            temperature
            airHumidity
            light
            greenGrowth
            plantID
            createdAt
        }
    }
`;

export const GET_USER = `
    query {
        users(username: "justinwang") {
            id
            firstName
            lastName
            username
            email
            password
        }
    }
`;

export const CREATE_USER = `
    mutation {
        createUser(
            firstName: "frontend-fN",
            lastName: "frontend-lN",
            username: "u-frontend",
            email: "frontend@f.com",
            password: "frontend"
        ) {
            id
            firstName
            lastName
            username
            email
            password
        }
    }
`

export const GET_NOTE = `
    query {
        notes(plantID: "plantidNote") {
            title
            text
            plantID
        }
    }
`;

export const CREATE_NOTE = `
mutation {
  createNote(
    text: "frontend-text",
    title: "frontend-title",
    plantID: "frontend-id"
  ) {
    id
    text
    title
    plantID
    updatedAt
  }
}`

export const GET_PLANT = `
    query {
        plants(ownerID: "ownerid") {
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
export const GET_NOTIFICATION = gql`
    query {
        notification(plantID: "plant") {
            id
            label
            type
            plantID
            createdAt
        }
    }
`;

export const GET_NOTIFICATION_STRING = `
    query {
        notification(plantID: "plant") {
            id
            label
            type
            plantID
            createdAt
        }
    }
`;

export const VITALS_SUBCRIPTION = gql`
    subscription {
        vital(deviceID: "yousef-device"){
            mutation
            data{
                id
                soilMoisture
                temperature
                airHumidity
                light
                greenGrowth
                plantID
                createdAt
            }
        }
    }
`;

export const NOTIFICATIONS_SUBCRIPTION = gql`
    subscription {
        notification(deviceID: "yousef-device"){
            mutation
            data{
                id
                label
                type
                plantID
                createdAt
            }
        }
    }
`;