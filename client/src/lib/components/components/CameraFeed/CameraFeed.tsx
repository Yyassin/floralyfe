import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"
import { Box, Center, Flex } from "@chakra-ui/react"
import styles from "./CameraFeed.module.scss"
import useWebSocket from "lib/components/hooks/useWebSocket";
import { useStore } from "lib/store/store";
import { config, topics } from "lib/config";

const INCREMENT = 2;

const CameraFeed = (props: {url: string}) => {
    const ws = useWebSocket(config.WS_URL, 5, 1500);
    const { offsetAngle, angle } = useStore((state) => ({
        offsetAngle: state.offsetAngle,
        angle: state.angle
    }));

    const turn = (increment: number) => {
        offsetAngle(increment);

        const msg = {
            topic: "servo-turn-angle",
            angle: angle + increment
        }

        ws.send(msg, topics.CAMERA)
    }


    return (
        <Box
            width={2000}
            height={350}
            backgroundImage={`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.0)), url('${props.url}')`}
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
                    backgroundImage={"linear-gradient(90deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.0))"}
                    className="plant-update-arrow-panel"
                    onClick={() => turn(-INCREMENT)}
                >
                    <ChevronLeftIcon 
                        color="white"
                        w={200}
                        h={50}
                    />
                </Center>
                <Center
                    width={"20%"}
                    height={350}
                    backgroundImage={"linear-gradient(-90deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.0))"}
                    className="plant-update-arrow-panel"
                    onClick={() => turn(INCREMENT)}
                >
                    <ChevronRightIcon
                        color="white"
                        w={200}
                        h={50}
                    />
                </Center>
            </Flex>
        </Box>
    )
}

export default CameraFeed;