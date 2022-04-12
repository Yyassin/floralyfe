/**
 * ChannelTelemetry.tsx
 * 
 * Renders live registration vitals
 * on registration screen.
 * @author Yousef
 */

import React, { useEffect, useState } from "react";
import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { deepLog } from "lib/components/hooks/validate";
import { useStore } from "lib/store/store";

const ChannelTelemetry = () => {
    /**
     * The channel telemetry data live from state.
     */
    const { data } = useStore((state) => ({
        data: state.channelTelemetry
    }));

    /**
     * Generates a random number between 0 and max (for testing).
     * @param max number, the maximum bound.
     * @returns number, the random number.
     */
    const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
    };

    /**
     * Simulates a randomly generated registration vital (for testing).
     */
    const simulate = () => {
        const dataset = {
            common: {
                temperature: getRandomInt(35),
                humidity: getRandomInt(100) / 100,
                waterLevel: getRandomInt(100) / 100,
            },
            channel1: {
                moisture: {
                    value: getRandomInt(100) / 100,
                    gpio: 15,
                },
                waterPump: {
                    gpio: 16,
                },
            },
            channel2: {
                moisture: {
                    value: getRandomInt(100) / 100,
                    gpio: 23,
                },
                waterPump: {
                    gpio: 24,
                },
            },
        } as any;

        deepLog("RECEIVED LIVE VITALS");
        deepLog(dataset);
        // setData(dataset);
    };

    return (
        <>
            {/* <Button onClick={simulate}>simulate</Button> */}
            <Flex justifyContent={"space-between"}>
                {Object.keys(data).map((channel) => {
                    const channelMeta = data[channel] as any;
                    return (
                        <Box width={300}>
                            <Center mb={5}>
                                <Heading>{channel}</Heading>
                            </Center>

                            {Object.keys(channelMeta).map((key, idx) => {
                                // Format the data according to type.
                                let value = channelMeta[key];

                                switch (key) {
                                    case "moisture": {
                                        key = `moisture (GPIO: ${value.gpio})`;
                                        value = `${(value.value * 100).toFixed(
                                            2
                                        )}%`;
                                        break;
                                    }

                                    case "waterPump": {
                                        key = `waterPump (GPIO: ${value.gpio})`;
                                        value = "connected";
                                        break;
                                    }

                                    case "temperature": {
                                        value = `${value.toFixed(2)} C`;
                                        break;
                                    }

                                    case "airHumidity": {
                                        value = `${value.toFixed(2)} %`;
                                        break;
                                    }

                                    default: {
                                        value = `${(value * 100).toFixed(2)}%`;
                                        break;
                                    }
                                }

                                return (
                                    <Box key={`${key}-${idx}`} mb={3}>
                                        <Flex>
                                            <Text fontWeight="bold">
                                                {`${key}:`} &nbsp;
                                            </Text>
                                            {value}
                                        </Flex>
                                    </Box>
                                );
                            })}
                        </Box>
                    );
                })}
            </Flex>
        </>
    );
};

export default ChannelTelemetry;
