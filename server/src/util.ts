/**
 * Contains general utility funtions
 */

import { inspect } from "util";

/**
 * Creates a deeplog of the specified element
 * (used to print all nested levels of an object).
 *
 * @param x any, the item to log.
 */
const deepLog = (x: any) =>
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
const debug = (...args: any[]) => {
    if (process.env.DEVELOPMENT) console.log("[DEBUG]", ...args);
};

export { deepLog, debug };
