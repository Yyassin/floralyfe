/**
 * util.ts
 * 
 * Contains general utility funtions
 * @author Yousef
 */

import { inspect } from "util";
import chalk from "chalk";

/* Log colour definitions */
const debugFg = chalk.bold.green;
const errorFg = chalk.bold.red;

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
    if (process.env.DEVELOPMENT) console.log(debugFg("[DEBUG]", ...args));
};

/**
 * Console log wrapper to output tagged error log in red.
 * @param args any[], log arguments.
 */
 const logError = (...args: any[]) => {
    console.log(errorFg("[ERROR]", ...args));
};

/**
 * Pauses execution for the specified number of milliseconds.
 * @param ms number, the number of milliseconds.
 * @returns Promise<void> the empty promise delay.
 */
const delay = (ms: number): Promise<void> => {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export { deepLog, debug, logError, delay };
