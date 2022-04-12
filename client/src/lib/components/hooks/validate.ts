/**
 * validate.ts
 *
 * Validates received messages and subscriptions
 * as part of end-to-end test.
 * @author Yousef
 */

import assert from "assert";
import { inspect } from "util";

/**
 * Deeplogs the specified object x.
 * @param x any, the object to deeplog.
 */
export const deepLog = (x: any) =>
    debug(
        inspect(x, {
            depth: Infinity,
            colors: true,
        })
    );

/**
 * Console log wrapper to only log in debug mode.
 * @param args any[], log arguments.
 */
const debug = (msg: any) => {
    if (process.env.NEXT_PUBLIC_DEVELOPMENT) console.log(`[DEBUG] ${msg}`);
};

// Expected vital to be received.
const expected_vital = {
    airHumidity: 33.2,
    createdAt: "2022-03-10T07:35:05.538Z",
    greenGrowth: 10.8,
    light: 0.33,
    plantID: "yousef-plant",
    soilMoisture: 14.2,
    temperature: 22.3,
};
const EPSILON = 0.01;

/**
 * Debug logs and validates received websocket messages
 * as part of end-to-end communication test.
 * @param msg any, the message to validate and log.
 * @param topic string, the message topic.
 */
export const validate = (msg: any, topic: string) => {
    switch (topic) {
        case "vitals-topic": {
            deepLog("Got vital message: validating...");
            deepLog(msg);

            const vital = msg.payload.vital;
            assert(
                Math.abs(vital.airHumidity - expected_vital.airHumidity) <
                    EPSILON
            );
            assert(
                Math.abs(vital.greenGrowth - expected_vital.greenGrowth) <
                    EPSILON
            );
            assert(Math.abs(vital.light - expected_vital.light) < EPSILON);
            assert(
                Math.abs(vital.soilMoisture - expected_vital.soilMoisture) <
                    EPSILON
            );
            assert(
                Math.abs(vital.temperature - expected_vital.temperature) <
                    EPSILON
            );
            assert(vital.createdAt == expected_vital.createdAt);
            assert(expected_vital.plantID == vital.plantID);

            console.log("Test passed!");
            break;
        }

        case "getUser": {
            deepLog("Got user");
            deepLog(msg);
            break;
        }

        case "getCUser": {
            deepLog("Created user.");
            deepLog(msg);
            break;
        }

        case "getPlant": {
            deepLog("Got Plant");
            deepLog(msg);
            break;
        }

        case "getNote": {
            deepLog("Got Note");
            deepLog(msg);
            break;
        }

        case "getCNote": {
            deepLog("Created Note");
            deepLog(msg);
            break;
        }

        case "getVitals": {
            deepLog("Got Vital");
            deepLog(msg);
            break;
        }

        case "getNotification": {
            deepLog("Got Notification");
            deepLog(msg);
            break;
        }

        case "subVital": {
            deepLog("Sub vital");
            deepLog(msg);
            break;
        }

        case "subNotification": {
            deepLog("Sub notification");
            deepLog(msg);
            break;
        }
    }
};
