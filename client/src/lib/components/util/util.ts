/**
 * util.ts
 *
 * Utility functions.
 * @author Yousef
 */

/**
 * Generates and returns a universal unique
 * identifier.
 * @returns the uuid.
 */
export const uuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
};

/**
 * Clamps the specified number between
 * the specified minimum and maximum inclusive.
 * @param num number, the number to clamp.
 * @param min number, the minimum.
 * @param max number, the maximum.
 * @returns number, the clamped number.
 */
export const clamp = (num: number, min: number, max: number) =>
    Math.min(Math.max(num, min), max);
