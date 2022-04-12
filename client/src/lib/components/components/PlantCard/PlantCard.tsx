/**
 * PlantCard.tsx
 *
 * Renders a plant card to display plant species, name and
 * status. Clicking on the card sets this as the selected plant.
 * @author Yousef
 */

import React from "react";
import { Badge, Box, Image, Text, useColorMode } from "@chakra-ui/react";
import { useStore } from "lib/store/store";
import { Plant } from "lib/store/slices/plantSlice";
import { deepLog } from "lib/components/hooks/validate";

const PlantCard = (props: Plant) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { selectedPlantID, setSelectedPlantID, vitals } = useStore(
        (state) => ({
            selectedPlantID: state.selectedPlantID,
            setSelectedPlantID: state.setSelectedPlantID,
            vitals: state.vitals,
        })
    );
    const selected = props.id === selectedPlantID;
    const live = vitals[props.id]?.live;

    const gradient =
        colorMode === "light"
            ? "linear(to-br, green.200, white)"
            : "linear(to-br, green.800, gray.900)";

    return (
        <Box
            margin={5}
            marginLeft={0}
            width={700}
            maxW="md"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bgGradient={selected ? gradient : ""}
            role="setId"
            onClick={() => {
                deepLog(`Sending camera msg to turn to plant: ${props.id}`);
                setSelectedPlantID(props.id);
            }}
        >
            <Box p="6">
                <Box display="flex" alignItems="baseline">
                    <Badge
                        role="criticality"
                        borderRadius="full"
                        px="2"
                        colorScheme={!live?.critical ? "green" : "yellow"}
                    >
                        {!live?.critical ? "optimal" : "critical"}
                    </Badge>
                    <Box
                        color="gray.500"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="uppercase"
                        ml="2"
                        role="channel"
                    >
                        Connected to channel {props.channel}
                    </Box>
                </Box>

                <Box
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated
                    role={"name"}
                >
                    {props.name}
                </Box>

                <Box>
                    <Box as="span" color="gray.600" fontSize="sm">
                        <Text role="species" as="i">
                            {props.species}
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default PlantCard;
