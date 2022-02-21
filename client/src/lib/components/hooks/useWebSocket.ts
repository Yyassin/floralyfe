/**
 * Connects to a specified WebSocket and 
 * exposes the interface through hooks. 
 */

import React, { useEffect, useRef, useState } from "react";

type Callback = (...args: any[]) => any;            // General function
// Topic -> callback subscription list. Callbacks are
// fired whenever a message with "topic" is received.
interface Subscriptions {                   
    [topic: string]: Callback[];                    // TODO: want to be able to remove later so add ids
}

// Socket types
type WSData = any;                                  // Data received
type WSSend = (data: any) => (data: any) => void;   // Send Function

// Socket interface 
interface ISocket {
    send: WSSend;                                   // Send function
    data: WSData;                                   // Received data
    readyState: boolean;                            // True if socket connected, false otherwise.
    addSubscription: (topic: string, callback: Callback) => void;   // Adds a subscription
}

/**
 * Connects to the specified WebSocket and
 * exposes its API.
 * @param socketUrl string, the WebSocket url.
 * @param retry number, number of reconnect attempts.
 * @param retryInterval number, time to wait between connection 
 *                      attempts in ms.
 * @returns ISocket, the socket interface.
 */
export default function useWebSocket(
    socketUrl: string,
    retry: number,
    retryInterval: number
): ISocket {
    // const isSSR = typeof window === "undefined";
    // if (isSSR) return null as unknown as ISocket;               // Make sure this only runs client side.

    const ws = useRef<WebSocket>();                             // The WebSocket connection.
    const [data, setData] = useState<any>();                    // Stores latest received data.
    const [send, setSend] = useState<WSSend>(                   // Sends data over WebSocket
        (data: any) => (data: any) => undefined
    );
    const [retryAttempts, setRetryAttempts] = useState(retry);  // Retry counter
    const [readyState, setReadyState] = useState(false);        // State of our connection
    const [subscriptions, setSubscriptions] = useState<Subscriptions>({});  // Map topics to subscription callbacks

    /**
     * Adds a callback to the specified topic.
     * @param topic string, the topic to add a callback to.
     * @param callback Callback, the callback function.
     */
    const addSubscription = (topic: string, callback: Callback) => {
        if (!subscriptions.topic) {
            subscriptions.topic = [];
        }

        setSubscriptions({
            ...subscriptions,
            [topic]: [...subscriptions.topic, callback],
        });

        console.log(`Subscribed to ${topic}`);
    };

    /**
     * Notify all observers when message is received.
     * @param event MessageEvent<any>, the message receive event.
     */
    const onMessage = (event: MessageEvent<any>) => {
        const msg = formatMessage(event.data);  // Parse the message
        setData(msg);

        if (msg.topic) {
            subscriptions[msg.topic]?.forEach((callback) => {
                callback(msg.payload);
            });
        }
    };

    /**
     * Lifecycle method to setup socket and 
     * callbacks.
     */
    useEffect(() => {
        // Only connect if we aren't already connected.
        if (!ws.current || ws.current.CLOSED) {
            ws.current = new WebSocket(socketUrl);
        }

        // If we're still not connected, retry (terminates for now).
        if (!ws.current) {
            // setReadyState(false);
            // // retry logic
            // if (retryAttempts > 0) {
            //     setTimeout(() => {
            //         setRetryAttempts((retryAttempts: any) => retryAttempts - 1);
            //     }, retryInterval);
            // }'
            return;
        }

        // On connection, update ready state and mount send/receive functions.
        ws.current.onopen = () => {
            console.log("Connected to socket");
            setReadyState(true);

            // Function to send messages
            setSend((data: any) => {
                return (data: any) => {
                    try {
                        const d = JSON.stringify(data);
                        ws.current!.send(d);
                        return true;
                    } catch (err) {
                        return false;
                    }
                };
            });

            // Receive messages callback.
            ws.current!.onmessage = onMessage;
        };

        // On close we should update connection state
        // and retry connection
        ws.current.onclose = () => {
            // setReadyState(false);
            // // retry logic
            // if (retryAttempts > 0) {
            //     setTimeout(() => {
            //         setRetryAttempts((retryAttempts: any) => retryAttempts - 1);
            //     }, retryInterval);
            // }
        };

        // Terminate connection on unmount
        return () => {
            ws.current!.close();
        };

        // Retry dependency here triggers the connection attempt
    }, [retryAttempts, subscriptions]);
    return { send, data, readyState, addSubscription };
}

/**
 * Parses the specified message into
 * JSON format.
 * @param data any, the data to parse.
 * @returns any, the parsed data.
 */
const formatMessage = (data: any): any => {
    try {
        const parsed = JSON.parse(data);
        return parsed;
    } catch (err) {
        return data;
    }
};
