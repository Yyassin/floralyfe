import { Flex, Link, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useWebSocket from "../hooks/useWebSocket";
import { useStore } from "../../store/store";
import { gql, useQuery } from "@apollo/client";

const GET_VITALS = gql`
    query {
        vitals {
            id
            soilMoisture
            temperature
            airHumidity
            plantID
            createdAt
        }
    }
`;

const VITALS_SUBCRIPTION = gql`
    subscription {
        vital(deviceID: "hello"){
            mutation
            data{
                id
                soilMoisture
                temperature
                airHumidity
                plantID
                createdAt
            }
        }
    }
`;

// Temporary prototype to demonstrate websocket functionality using hook
const WebSocketWrapper = () => {
    const {
        loading,
        error,
        data: gqlData,
        subscribeToMore,
    } = useQuery(GET_VITALS);

    if (!loading && gqlData) {
        console.log("GQL", gqlData);
    }

    const { cameraEncoded, setCameraEncoded } = useStore((state) => ({
        cameraEncoded: state.cameraEncoded,
        setCameraEncoded: state.setCameraEncoded,
    }));

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: VITALS_SUBCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                console.log("SUB", subscriptionData);
            },
        });

        return () => unsubscribe();
    }, [subscribeToMore]);

    const ws = useWebSocket("ws://localhost:5000", 5, 1500);
    const txtRef = useRef<any>();
    const [data, setData] = useState<any>("Nothing received yet...");

    const sendData = () => {
        if (!txtRef.current) return;

        const message = txtRef.current.value || "";
        if (message) ws.send(message, "");
    };

    const sendDataJSON = () => {
        if (!txtRef.current) return;

        const message = txtRef.current.value || "";
        if (message) ws.send(JSON.parse(message), "");
    };

    const subscribeToHello = () => {
        const msg = {
            topic: "subscribe",
            payload: {
                userID: "hello1",
            },
        };
        ws.send(msg, "");
    };

    useEffect(() => {
        ws.addSubscription("camera-topic", (data: any) => {
            setCameraEncoded(data.encoded);
        });
    }, []);

    useEffect(() => {
        if (ws.data) {
            if (typeof ws.data.message === "string") setData(ws.data.message);
            else if (typeof ws.data.message === "object")
                setData(JSON.stringify(ws.data.message));
        }
    }, [ws.data]);

    return (
        <Flex>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <form style={{ display: "flex", flexDirection: "column" }}>
                    <label>Message (string or json)</label>
                    <textarea name="message" rows={4} ref={txtRef} />
                    <input type="button" onClick={sendData} value="Send" />
                    <input
                        type="button"
                        onClick={sendDataJSON}
                        value="Send JSON"
                    />
                </form>
                <button onClick={subscribeToHello}>Subscribe to "hello"</button>
                <p>connection: {String(ws.readyState)}</p>
                <p>socket: {data}</p>
                <p>store: {cameraEncoded}</p>
                {cameraEncoded && (
                    <img
                        height="480px"
                        width="640px"
                        src={`data:image/jpeg;base64,${cameraEncoded}`}
                        alt=""
                    />
                )}
            </div>
        </Flex>
    );
};

export default WebSocketWrapper;
