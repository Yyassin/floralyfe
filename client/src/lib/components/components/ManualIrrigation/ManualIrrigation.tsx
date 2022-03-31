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
import { deepLog } from "lib/components/hooks/validate";

const ManualIrrigation = () => {
    const waterPlant = () => {
        deepLog("Sending manual irrigation msg.")
    };

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
                            HYDRATED
                        </Box>
                    </Box>
                    <Center
                        bgColor={"green.300"}
                        borderRadius="lg"
                        height={50}
                        width={50}
                    >
                        <PhoneIcon color="white" />
                    </Center>
                </Flex>
            </Box>
        </Box>
    );
};

export default ManualIrrigation;
