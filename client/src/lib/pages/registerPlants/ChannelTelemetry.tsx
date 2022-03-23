import React, { useEffect, useState } from "react";
import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";

const ChannelTelemetry = () => {
    const [data, setData] = useState({} as any);

    useEffect(() => {
        const dataset = {
            common: {
                temperature: 34,
                humidity: 0.55,
                waterLevel: 0.99,
            },
            channel1: {
                moisture: {
                    value: 0.30,
                    gpio: 15,
                },
                waterPump: {
                    gpio: 16,
                },
            },
            channel2: {
                moisture: {
                    value: 0.55,
                    gpio: 23,
                },
                waterPump: {
                    gpio: 24,
                },
            },
        } as any;
        setData(dataset)
    }, []);

    const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
      }

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

        setData(dataset)
    }

    return (
        <>
            <Button onClick={simulate}>
                simulate
            </Button>
            <Flex justifyContent={"space-between"}>
            {Object.keys(data).map((channel) => {
                const channelMeta = data[channel] as any;
                return (
                    <Box width={300}>
                        <Center mb={5}>
                            <Heading>{channel}</Heading>
                        </Center>

                        {Object.keys(channelMeta).map((key, idx) => {
                            let value = channelMeta[key];
                            
                            switch(key) {
                                case "moisture": {
                                    key = `moisture (GPIO: ${value.gpio})`
                                    value = `${(value.value * 100).toFixed(2)}%`
                                    break;
                                }

                                case "waterPump": {
                                    key = `waterPump (GPIO: ${value.gpio})`
                                    value = "connected"
                                    break;
                                }

                                case "temperature": {
                                    value = `${(value)} C`
                                    break;
                                }

                                default: {
                                    value = `${(value * 100).toFixed(2)}%`
                                    break;
                                }
                            }

                            return (
                                <Box key={`${key}-${idx}`} mb={3}>
                                    <Flex>
                                        <Text fontWeight="bold" >
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
