/**
 * index.ts
 * 
 * Joins and exports all queries. 
 */

import { CREATE_USER } from "./createUser";
import { GET_USER } from "./getUser";
import { GET_VITALS, NOTIFICATIONS_SUBCRIPTION, VITALS_SUBCRIPTION } from "./getSubscription";
import { GET_PLANT } from "./getPlants";

export {
    CREATE_USER,
    GET_USER,
    GET_VITALS,
    GET_PLANT,
    VITALS_SUBCRIPTION,
    NOTIFICATIONS_SUBCRIPTION
}