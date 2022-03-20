import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Button } from "@chakra-ui/react";
import { config, topics } from "lib/config";
import { useStore } from "lib/store/store";
import { useEffect } from "react";
import useWebSocket from "../../hooks/useWebSocket";
import { deepLog, validate } from "../../hooks/validate";
import { CREATE_NOTE, CREATE_USER, GET_NOTE, GET_NOTIFICATION, GET_NOTIFICATION_STRING, GET_PLANT, GET_USER, GET_VITALS, GET_VITALS_STRING, NOTIFICATIONS_SUBCRIPTION, VITALS_SUBCRIPTION } from "./query";
import { queryHelper } from "./queryHelper";

const subscribeMsg = {
    topic: topics.SUBSCRIBE,
    payload: {
        userID: config.DEVICE_ID,
    },
}

const unsubscribeMsg = {
    topic: topics.UNSUBSCRIBE,
    payload: {
        userID: config.DEVICE_ID,
    },
}

const turnCameraMsg = {
    topic: topics.CAMERA,
    userID: config.USER_ID,
    payload: {
        topic: "turn",
        yaw: 1.1
    }
}

const registerPlantMsg = {
    topic: topics.CAMERA,
    userID: config.USER_ID,
    payload: {
        topic: "plant-registeration",
        yaw: 3.1,
        plantID: "yousef-plant-id"
    }
}

const setSenseIconMsg = {
    topic: topics.VITAL,
    userID: config.USER_ID,
    payload: {
        icon: "MOISTURE_ICON"
    }
}

const waterPlantMsg = {
    topic: topics.IRRIGATION,
    userID: config.USER_ID,
    payload: {
        wateringTimeout: 5.5
    }
}

const Test = () => {
    const {
        loading,
        error,
        data: gqlData,
        subscribeToMore,
    } = useQuery(GET_VITALS);
    
    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: VITALS_SUBCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                deepLog("Got vital subscription")
                deepLog(subscriptionData);
            },
        });

        return () => unsubscribe();
    }, [subscribeToMore]);

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: NOTIFICATIONS_SUBCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                deepLog("Got notification subscription")
                deepLog(subscriptionData);
            },
        });

        return () => unsubscribe();
    }, [subscribeToMore]);

    const createNote = async () => {
        console.log("Created note:", CREATE_NOTE);
        const data = await queryHelper(CREATE_NOTE, {})
        deepLog(data)
    }

    const createUser = async () => {
        console.log("Created User:", CREATE_USER);
        const data = await queryHelper(CREATE_USER, {})
        deepLog(data)
    }

    const fetchNote = async () => {
        console.log("Fetching note with id plantidNote")
        const data = await queryHelper(GET_NOTE, {})
        deepLog(data)
    }

    const fetchUser = async () => {
        console.log("Fetching username with id justinwang")
        const data = await queryHelper(GET_USER, {})
        deepLog(data)
    }

    const fetchPlant = async () => {
        console.log("Fetching plant with owner ownerid")
        const data = await queryHelper(GET_PLANT, {})
        deepLog(data)
    }

    const fetchNotification = async () => {
        console.log("Fetching notification with plantId plant")
        const data = await queryHelper(GET_NOTIFICATION_STRING, {})
        deepLog(data)
    }

    const fetchVital = async () => {
        console.log("Fetching vital with plantId ownerid")
        const data = await queryHelper(GET_VITALS_STRING, {})
        deepLog(data)
    }

    const gqlFetch = {
        createNote,
        createUser,
        fetchNote,
        fetchNotification,
        fetchPlant,
        fetchUser,
        fetchVital
    } as any;

    const { cameraEncoded, setCameraEncoded } = useStore((state) => ({
        cameraEncoded: state.cameraEncoded,
        setCameraEncoded: state.setCameraEncoded,
    }));

    const ws = useWebSocket(config.WS_URL, 5, 1500);
    useEffect(() => {
        ws.addSubscription("camera-topic", (data: any) => {
            setCameraEncoded(data.encoded);
        });
    }, []);

    const subscribe = () => ws.send(subscribeMsg);
    const unsubscribe = () => ws.send(unsubscribeMsg);
    const turnCamera = () => ws.send(turnCameraMsg);
    const setSenseIcon = () => ws.send(setSenseIconMsg);
    const registerPlant = () => ws.send(registerPlantMsg);
    const waterPlant = () => ws.send(waterPlantMsg);

    const wsMessages = {
        subscribe,
        turnCamera, 
        setSenseIcon,
        registerPlant,
        waterPlant,
        unsubscribe
    } as any;

    const testAll = () => {
        Object.keys(wsMessages).forEach((message: string, idx: number) => {
            const messageFn = wsMessages[message];
            setTimeout(messageFn, idx * 1500);
        })
    }

    const testMessages = { ...wsMessages, testAll };
    
    return(
        <div className = "test-wrapper">
            <h1>WebSocket Tests</h1>
            <div className = "test-buttons-wrapper">
                {
                    Object.keys(testMessages).map((name: any, idx) => (
                        <Button 
                            margin={5} 
                            className="test-button" 
                            colorScheme='teal' 
                            variant='solid' 
                            key={idx}
                            onClick={testMessages[name]}
                        >
                            {name}
                        </Button>
                    ))
                }
            </div>
            <h1>GQL Fetch Tests</h1>
            <div className = "test-buttons-wrapper">
                {
                    Object.keys(gqlFetch).map((name: any, idx) => (
                        <Button 
                            margin={5} 
                            className="test-button" 
                            colorScheme='teal' 
                            variant='solid' 
                            key={idx}
                            onClick={gqlFetch[name]}
                        >
                            {name}
                        </Button>
                    ))
                }
            </div>
            <div className = "image-feed" style={{display: "flex", flexDirection:"row"}}>
                {cameraEncoded && (
                    <img
                        height="480px"
                        width="640px"
                        src={`data:image/jpeg;base64,${cameraEncoded}`}
                        alt=""
                    />
                )}
            </div>
            
            
        </div>
    )
}

export default Test;