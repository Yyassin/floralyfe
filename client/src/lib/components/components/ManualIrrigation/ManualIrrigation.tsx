/**
 * ManualIrrigation.tsx
 *
 * Renders a button to trigger automatic
 * irrigation event on the RPi.
 * @author Yousef
 */

import React from "react";
import { Box, Center, Flex } from "@chakra-ui/react";
import { useStore } from "lib/store/store";
import useWebSocket from "lib/components/hooks/useWebSocket";
import { config } from "lib/config";
import { BsWater } from "react-icons/bs";

const ManualIrrigation = () => {
    const ws = useWebSocket(config.WS_URL, 5, 1500);
    const { user } = useStore((state) => ({
        user: state.user,
    }));

    /**
     * Sends a automatic irrigation
     * requests to the RPi to water the selected plant.
     */
    const waterPlant = () => {
        const msg = {
            topic: "irrigation-topic",
            userID: user?.id,
            payload: {
                topic: "pump-override-topic",
            },
        };

        ws.send(msg);
    };

    return (
        <Box
            margin={5}
            marginLeft={0}
            width={200}
            height={70}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            _hover={{ bg: "gray.200" }}
            cursor={"pointer"}
            onClick={() => waterPlant()}
        >
            <Box p="3">
                <Flex justifyContent={"space-between"}>
                    <Box>
                        <Box display="flex" alignItems="baseline">
                            <Box
                                color="gray.500"
                                fontWeight="semibold"
                                letterSpacing="wide"
                                fontSize="xs"
                                textTransform="uppercase"
                            >
                                Water Plant
                            </Box>
                        </Box>

                        <Box
                            mt="1"
                            fontWeight="semibold"
                            as="h4"
                            lineHeight="tight"
                            isTruncated
                        >
                            HYDRATE
                        </Box>
                    </Box>
                    <Center
                        bgColor={"green.300"}
                        borderRadius="lg"
                        height={50}
                        width={50}
                    >
                        <BsWater color="white" fontSize={30} />
                    </Center>
                </Flex>
            </Box>
        </Box>
    );
};

export default ManualIrrigation;
