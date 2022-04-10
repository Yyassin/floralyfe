import React, { useRef } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { getDayOffset, notifications } from "lib/store/mock";
import { useStore } from "lib/store/store";
import NotificationCard from "./NotificationCard";
import { deepLog } from "lib/components/hooks/validate";
import { uuid } from "lib/components/util/util";
import { BsDropletFill, BsWater } from "react-icons/bs";
import { FaTemperatureLow } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
const ICONS = ["MOISTURE", "WATER_LEVEL", "TEMPERATURE", "HUMIDITY"] as const;

const Notifications = () => {
    const counter = useRef(0);
    const {
        selectedPlantID,
        notifications,
        addNotifcation,
        loadNotifications,
    } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        notifications: state.notifications,
        addNotifcation: state.addNotification,
        loadNotifications: state.loadNotifications,
    }));

    //console.log("notifications")
    //deepLog(notifications)

    const clearNotifications = () => {
        loadNotifications(selectedPlantID, []);
    };

    const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
    };

    const addNotificationWrapper = () => {
        const notification = {
            id: uuid(),
            label: ICONS[counter.current % ICONS.length],
            icon: ICONS[counter.current % ICONS.length],
            plantID: selectedPlantID,
            date: getDayOffset(counter.current).toString(),
        };

        deepLog("RECEIVED NOTIFICATION");
        deepLog(notification);

        addNotifcation(notification);
        counter.current += getRandomInt(5);
    };

    const loadNotificationsWrapper = () => {
        for (let i = 0; i < 100; i++) {
            addNotificationWrapper();
        }
    };

    return (
        <Box w={[200, 200, 350, 500, 600, 900]} position="relative">
            {/* <Flex>
                <Heading as="h2" size="md" mr={5}>
                    Notifications
                </Heading>
                <Button mr={5} onClick={clearNotifications}>
                    Clear Notifications
                </Button>
                <Button mr={5} onClick={addNotificationWrapper}>
                    Add Notifications
                </Button>
                <Button mr={5} onClick={loadNotificationsWrapper}>
                    Load Notifications
                </Button>
            </Flex> */}
            {!notifications[selectedPlantID]?.length ? (
                <Text mt={5}>
                    This plant does not have any notifications yet...
                </Text>
            ) : (
                <Box
                    height={350}
                    width={"100%"}
                    overflowY={"auto"}
                    overflowX={"hidden"}
                >
                    {(notifications[selectedPlantID] || []).map(
                        (notification: any, idx: number) => (
                            <NotificationCard key={idx} {...notification} />
                        )
                    )}
                </Box>
            )}
        </Box>
    );
};

export default Notifications;
