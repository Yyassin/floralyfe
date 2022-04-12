/**
 * toast.ts
 *
 * Wrapper over react-toastify to display
 * notification toasts.
 * @author Yousef
 */

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/*** Wrapped Toast Methods ***/

/**
 * Closes/dismisses all active toasts.
 */
const dismissAll = () => toast.dismiss();

/**
 * Displays a success toast.
 * @param message string, the message to display.
 */
const toastSuccess = (message: string) =>
    toast.success(message, {
        position: "top-right",
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: { fontSize: 13 },
    });

/**
 * Displays an error toast.
 * @param message string, the message to display.
 */
const toastError = (message: string) =>
    toast.error(message, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

export { dismissAll, toastSuccess, toastError };
