/**
 * Notifications.tsx
 *
 * Renders all notifications for the currently
 * selected plant.
 * @author Yousef
 */

import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { useStore } from "lib/store/store";
import NotificationCard from "./NotificationCard";

const Notifications = () => {
    const { selectedPlantID, notifications } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        notifications: state.notifications,
        addNotifcation: state.addNotification,
        loadNotifications: state.loadNotifications,
    }));

    return (
        <Box w={[200, 200, 350, 500, 600, 900]} position="relative">
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
