import React, { useRef, useState } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { identifyPlant, toBase64 } from "lib/api/plantId";
import LineChartWrapper from "lib/components/components/LineChart/LineChartWrapper";
import ManualIrrigation from "lib/components/components/ManualIrrigation/ManualIrrigation";
import Notes from "lib/components/components/Note/Notes";
import Notification from "lib/components/components/Notification/Notifications";
import PlantExtraInfo from "lib/components/components/PlantExtraInfo/PlantExtraInfo";
import PlantUpdate from "lib/components/components/PlantUpdate/PlantUpdate";
import SenseHatIcon from "lib/components/components/SenseHatIcon/SenseHatIcon";
import VitalsCollection from "lib/components/components/VitalsCollection/VitalsCollection";
import { user } from "lib/store/mock";
import { useEffect } from "react";
import styles from "./Home.module.scss";
import { useStore } from "lib/store/store";
import { useRouter } from "next/router";
import PlantCard from "lib/components/components/PlantCard/PlantCard";
import { deepLog } from "lib/components/hooks/validate";
import useWebSocket from "lib/components/hooks/useWebSocket";
import { config } from "lib/config";
import { useQuery } from "@apollo/client";
import {
    GET_VITALS,
    NOTIFICATIONS_SUBCRIPTION,
    VITALS_SUBCRIPTION,
} from "lib/api/queries";
import { toastSuccess, toastError, dismissAll } from "../../../components/util/toast";


const useEventListener = (eventName: any, handler: any) => {
    if (typeof window === "undefined") return;
    const element = window;

    const savedHandler = useRef();

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        // @ts-ignore
        const eventListener = (event: any) => savedHandler.current(event);
        element.addEventListener(eventName, eventListener);
        return () => {
            element.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
};

const Home = () => {
    const ws = useWebSocket(config.WS_URL, 5, 1500);
    const {
        user,
        plants,
        selectedPlantID,
        addPersistedVital,
        addNotification,
    } = useStore((state) => ({
        user: state.user,
        plants: state.plants,
        selectedPlantID: state.selectedPlantID,
        addPersistedVital: state.addPersistedVital,
        addNotification: state.addNotification,
    }));

    // event listeners
    const handler = ({ key }: any) => {
        let msg: any;
        switch(String(key)) {
            case "F8": {
                msg = {
                    topic: "vitals-topic",
                    userID: user?.id,
                    payload: {
                        topic: "toggle-water"
                    },
                };
                break;
            }

            case "F2": {
                msg = {
                    topic: "vitals-topic",
                    userID: user?.id,
                    payload: {
                        topic: "toggle-channel-1"
                    },
                };
                break;
            }

            case "F4": {
                msg = {
                    topic: "vitals-topic",
                    userID: user?.id,
                    payload: {
                        topic: "toggle-channel-2"
                    },
                };
                break;
            }

            case "F6": {
                msg = {
                    topic: "vitals-topic",
                    userID: user?.id,
                    payload: {
                        topic: "increase-channel"
                    },
                };
                break;
            }

            case "F9": {
                msg = {
                    topic: "camera-topic",
                    userID: user?.id,
                    payload: {
                        topic: "take-pictures"
                    },
                };
                break;
            }
        }

        ws.send(msg);
    };

    useEventListener("keydown", handler);

    // Use effect to fetch all

    // Subscribe to vitals and notification
    const { subscribeToMore } = useQuery(GET_VITALS, {
        variables: { plantID: selectedPlantID },
    });

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: VITALS_SUBCRIPTION,
            variables: { deviceID: user?.deviceID },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                console.warn("Got vital subscription");
                const vital = subscriptionData.data.vital.data;

                // deepLog(subscriptionData);
                addPersistedVital(vital);
            },
        });

        return () => unsubscribe();
    }, [subscribeToMore]);

    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: NOTIFICATIONS_SUBCRIPTION,
            variables: { deviceID: user?.deviceID },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                dismissAll();

                console.warn("Got notification subscription");
                const notification = subscriptionData.data.notification.data;
                toastSuccess(`Got notification: ${notification.type}`)

                // deepLog(subscriptionData);
                addNotification(notification);
            },
        });

        return () => unsubscribe();
    }, [subscribeToMore]);

    useEffect(() => {
        const subscriptionMessage = {
            topic: "subscribe",
            payload: {
                deviceID: user?.deviceID,
            },
        };

        const dashboardMessage = {
            topic: "vitals-topic",
            userID: user?.id,
            payload: {
                topic: "dashboard-topic",
            },
        };

        const selectedPlantMessage = {
            topic: "vitals-topic",
            userID: user?.id,
            payload: {
                topic: "select-plant-topic",
                plantID: selectedPlantID,
            },
        };

        ws.send(subscriptionMessage);
        ws.send(dashboardMessage);
        ws.send(selectedPlantMessage);
    }, [user, selectedPlantID]);

    const router = useRouter();

    useEffect(() => {
        if (!user) {
            deepLog("Not authenticated.");
            router.push("/login");
        } else if (!Object.keys(plants).length) {
            deepLog("User has no plants => register plants");
            router.push("/registerplants");
        }
    }, []);

    return (
        user &&
        Object.keys(plants).length && (
            <div className={styles.home_wrapper}>
                <Box margin={5}>
                    <Heading as="h1" size="md" paddingTop={5}>
                        Welcome back, {user?.firstName}
                    </Heading>
                    <Flex justifyContent={"space-between"}>
                        <Flex>
                            {Object.keys(plants).map((plantId) => (
                                <PlantCard key={plantId} {...plants[plantId]} />
                            ))}
                        </Flex>
                        <Flex>
                            <ManualIrrigation />
                            <SenseHatIcon />
                        </Flex>
                    </Flex>
                    <Flex>
                        <PlantUpdate />
                        <PlantExtraInfo {...plants[selectedPlantID]} />
                    </Flex>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <VitalsCollection />
                        <LineChartWrapper />
                    </div>
                    <Flex>
                        <Notes />
                        <Notification />
                    </Flex>

                    {/* <img
                    id="plant-img"
                    src="https://s3.amazonaws.com/finegardening.s3.tauntoncloud.com/app/uploads/vg-migration/2019/09/28011137/Shishito_containers.JPG"
                    alt=""
                /> */}
                </Box>
            </div>
        )
    );
};

export default Home;
