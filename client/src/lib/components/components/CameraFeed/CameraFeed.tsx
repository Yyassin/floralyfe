/**
 * CameraFeed.tsx
 *
 * Displays live image data from RPi device
 * in base64 format and provides servo turning controls.
 * @author Yousef
 */

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Center, Flex } from "@chakra-ui/react";
import styles from "./CameraFeed.module.scss";
import useWebSocket from "lib/components/hooks/useWebSocket";
import { useStore } from "lib/store/store";
import { config, topics } from "lib/config";
import { clamp } from "lib/components/util/util";

// Angle turn incrmenents in degrees.
const INCREMENT = 5;

const CameraFeed = (props: { url: string }) => {
    const ws = useWebSocket(config.WS_URL, 5, 1500);
    const { setAngle, angle, user, cameraEncoded } = useStore((state) => ({
        cameraEncoded: state.cameraEncoded,
        setAngle: state.setAngle,
        angle: state.angle,
        user: state.user,
    }));

    // Format encoded image into html src format.
    const url = `data:image/png;base64,${cameraEncoded}`.replace(
        /(\r\n|\n|\r)/gm,
        ""
    );

    /**
     * Sends a turn message to the raspberry pi
     * with the current servo angle.
     * @param increment number, the number of decrease to change
     * per turn click.
     */
    const turn = (increment: number) => {
        // Increment the angle but clamp [0, 180] to servo bounds.
        const newAngle = clamp(angle + increment, 1, 179);
        setAngle(newAngle);

        // Send the turn message to the RPi to turn the servo.
        const msg = {
            topic: topics.CAMERA,
            userID: user!.id,
            payload: {
                topic: "servo-turn-angle",
                angle: newAngle,
            },
        };

        const subscriptionMessage = {
            topic: "subscribe",
            payload: {
                deviceID: user?.deviceID,
            },
        };
        ws.send(subscriptionMessage);

        ws.send(msg);
    };

    // First box with "url" renders the base64 image
    return (
        <Box
            width={2000}
            height={350}
            backgroundImage={`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.0)), url('${url}')`}
            backgroundPosition={"center"}
            backgroundRepeat="no-repeat"
            backgroundSize={"cover"}
            objectFit={"cover"}
            position={"relative"}
            className={styles.camera_feed}
        >
            <Flex
                justifyContent={"space-between"}
                className="plant-update-arrows"
            >
                <Center
                    width={"20%"}
                    height={350}
                    backgroundImage={
                        "linear-gradient(90deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.0))"
                    }
                    className="plant-update-arrow-panel"
                    onClick={() => turn(INCREMENT)}
                >
                    <ChevronLeftIcon color="white" w={200} h={50} />
                </Center>
                <Center
                    width={"20%"}
                    height={350}
                    backgroundImage={
                        "linear-gradient(-90deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.0))"
                    }
                    className="plant-update-arrow-panel"
                    onClick={() => turn(-INCREMENT)}
                >
                    <ChevronRightIcon color="white" w={200} h={50} />
                </Center>
            </Flex>
        </Box>
    );
};

export default CameraFeed;
