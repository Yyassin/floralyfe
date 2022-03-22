import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";

const data = {
    common: {
        temperature: 0.34,
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

const ChannelTelemetry = () => {
    return (
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
    );
};

export default ChannelTelemetry;
