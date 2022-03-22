import React from "react";
import {
    ExternalLinkIcon,
    MoonIcon,
    PhoneIcon,
    StarIcon,
    ViewIcon,
} from "@chakra-ui/icons";
import {
    Badge,
    Box,
    Center,
    Flex,
    Image,
    Text,
    useColorMode,
} from "@chakra-ui/react";
import { useStore } from "lib/store/store";
import { useEffect, useState } from "react";

const ICONS = {
    MOISTURE: <PhoneIcon color="white" />,
    WATER_LEVEL: <ViewIcon color="white" />,
    TEMPERATURE: <MoonIcon color="white" />,
    HUMIDITY: <ExternalLinkIcon color="white" />,
} as const;

const IconImage = (icon: string) => {
    //@ts-ignore
    const IconComponent = () => ICONS[icon] as unknown as JSX.IntrinsicElements;

    return (
        <Center
            bgColor={"green.300"}
            borderRadius="lg"
            height={50}
            width={50}
        >
            {IconComponent()}
        </Center>
    );
};

const SenseHatIcon = () => {
    const [idx, setIdx] = useState(0);

    const incremenetIdx = () => {
        console.log(`Sending change sense hat icon msg: ${Object.keys(ICONS)[idx]}`)
        setIdx((idx + 1) % Object.keys(ICONS).length);
    }

    const { selectedPlantID, setSelectedPlantID } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        setSelectedPlantID: state.setSelectedPlantID,
    }));

    return (
        <Box
            margin={5}
            marginLeft={0}
            width={200}
            height={70}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            _hover={{bg: "gray.200"}}
            cursor={"pointer"}
            onClick={() => incremenetIdx()}
            role="sense-wrapper"
        >
            <Box p="3">
                <Flex
                    justifyContent={"space-between"}
                >
                    <Box>
                        <Box display="flex" alignItems="baseline">
                            <Box
                                color="gray.500"
                                fontWeight="semibold"
                                letterSpacing="wide"
                                fontSize="xs"
                                textTransform="uppercase"
                            >
                                SenseHat Icon
                            </Box>
                        </Box>

                        <Box
                            mt="1"
                            fontWeight="semibold"
                            as="h4"
                            lineHeight="tight"
                            isTruncated
                            role="sense-state"
                        >
                            {Object.keys(ICONS)[idx]}
                        </Box>
                    </Box>
                    { 
                        IconImage(Object.keys(ICONS)[idx]) 
                    }
                </Flex>
            </Box>
        </Box>
    );
};

export default SenseHatIcon;
