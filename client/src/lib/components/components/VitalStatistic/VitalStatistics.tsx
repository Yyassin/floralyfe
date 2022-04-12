/**
 * VitalStatistics.tsx
 *
 * Renders singular vital in props
 * as an icon, value and measurement bar for
 * aggregate in Vital telemetry.
 * @author Yousef
 */

import React from "react";
import { Box, Center, Heading, Progress } from "@chakra-ui/react";
import { RiPlantFill } from "react-icons/ri";
import { BsFillSunFill, BsMoisture, BsWater } from "react-icons/bs";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";

export interface VitalProps {
    name: string;
    value: string | number;
    percentage: number;
}

// Vital icons
const icons: any = {
    SOILMOISTURE: <BsMoisture color="white" fontSize={25} />,
    TEMPERATURE: <FaTemperatureHigh color="white" fontSize={25} />,
    AIRHUMIDITY: <WiHumidity color="white" fontSize={30} />,
    WATERLEVEL: <BsWater color="white" fontSize={25} />,
    LIGHT: <BsFillSunFill color="white" fontSize={25} />,
    GREENGROWTH: <RiPlantFill color="white" fontSize={25} />,
};

const VitalStatistic = (props: VitalProps) => {
    return (
        <Box
            margin={5}
            marginLeft={0}
            width={150}
            height={150}
            maxW="sm"
            borderRadius="lg"
            overflow="hidden"
        >
            <Box p="2" alignItems={"center"}>
                <Box display="flex" alignItems="baseline">
                    <Center
                        bgColor={"green.300"}
                        borderRadius="lg"
                        height={35}
                        width={35}
                    >
                        {icons[props.name.toUpperCase()]}
                    </Center>
                    <Box
                        color="gray.500"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize={10}
                        textTransform="uppercase"
                        ml="2"
                    >
                        {props.name}
                    </Box>
                </Box>

                <Box mt="1.5" fontWeight="semibold" as="h4">
                    <Heading as="h5" fontSize={20}>
                        {props.value}
                    </Heading>
                    <Progress
                        mt="3"
                        borderRadius={"lg"}
                        height={2}
                        colorScheme="green"
                        value={100 * props.percentage}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default VitalStatistic;
