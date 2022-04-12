/**
 * getSubscription.ts
 * 
 * The vital and notification subscription queries.
 */

import { gql } from "@apollo/client";

export const GET_VITALS = gql`
    query getVitals($plantID: ID!) {
        vitals(plantID: $plantID) {
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

export const VITALS_SUBCRIPTION = gql`
    subscription subscribeVitals($deviceID: ID!) {
        vital(deviceID: $deviceID){
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
    subscription subscribeNotifications($deviceID: ID!) {
        notification(deviceID: $deviceID){
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