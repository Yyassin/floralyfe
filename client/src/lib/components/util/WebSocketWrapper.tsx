import { Flex, Link, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useWebSocket from "../hooks/useWebSocket";
import { useStore } from "../../store/store";
import { useCollection } from "react-firebase-hooks/firestore";
import { firebase } from "../../../firebase/clientApp";
import { gql, useQuery } from "@apollo/client";

const GET_USERS = gql`
    query {
        users {
            name
        }
    }
`;

const USER_SUBCRIPTION = gql`
    subscription {
        user {
            mutation
            data {
                name
            }
        }
    }
`;

// Temporary prototype to demonstrate websocket functionality using hook
const db = firebase.firestore();
const WebSocketWrapper = () => {
    const {
        loading,
        error,
        data: gqlData,
        subscribeToMore,
    } = useQuery(GET_USERS);

    if (!loading && gqlData) {
        console.log("GQL", gqlData);
    }

    const { cameraEncoded, setCameraEncoded } = useStore((state) => ({
        cameraEncoded: state.cameraEncoded,
        setCameraEncoded: state.setCameraEncoded,
    }));

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: USER_SUBCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                console.log("SUB", subscriptionData);
            },
        });

        return () => unsubscribe();
    }, [subscribeToMore]);

    // const [users, usersLoading, usersError] = useCollection(
    //     // @ts-ignore
    //     db.collection("users"), {}
    // )
    // const addUser = async (a: string) => {
    //     await db.collection("users").doc("123").set({
    //         a
    //     })
    // }

    // if (!usersLoading && users) {
    //     users.docs.map((user) => console.log(user.data()));
    // }

    const ws = useWebSocket("ws:///c184-174-112-246-246.ngrok.io", 5, 1500);
    const txtRef = useRef<any>();
    const [data, setData] = useState<any>("Nothing received yet...");

    const sendData = () => {
        if (!txtRef.current) return;

        const message = txtRef.current.value || "";
        if (message) ws.send(message);
    };

    const sendDataJSON = () => {
        if (!txtRef.current) return;

        const message = txtRef.current.value || "";
        if (message) ws.send(JSON.parse(message));
    };

    const subscribeToHello = () => {
        const msg = {
            topic: "subscribe",
            payload: {
                userID: "hello",
            },
        };
        ws.send(msg);
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
                {/* <button onClick={() => addUser(txtRef.current.value || "")}></button> */}
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
