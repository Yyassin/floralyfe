/**
 * PlantExtraInfo.tsx
 *
 * Renders plant extra info card with extra
 * plant species description and link to wikipedia page.
 * @author Yousef
 */

import React from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
interface PlantExtraInfoProps {
    species: string;
    description: string;
    wiki: string;
}

const PlantExtraInfo = (props: PlantExtraInfoProps) => {
    return (
        <Box
            margin={5}
            marginLeft={0}
            width={750}
            height={350}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
        >
            <Flex justifyContent={"space-between"}>
                <Box
                    p="4"
                    width={2000}
                    height={350}
                    backgroundImage="linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.3)), url('https://cdn.hovia.com/app/uploads/Green-Tropical-Plant-Wallpaper-Mural-Plain.jpg')"
                    backgroundPosition={"center"}
                    backgroundRepeat="no-repeat"
                    backgroundSize={"cover"}
                    position={"relative"}
                >
                    <Heading as="h4" color={"white"} fontSize={20}>
                        More on <Text as="i">{props.species}</Text>
                    </Heading>
                    <Box>
                        <Box as="span" color="gray.300" fontSize="sm">
                            <Text mt={3} mb={3} fontSize={14}>
                                {props.description}
                            </Text>
                            {props.wiki !== "" && (
                                <a href={props.wiki} target="_blank">
                                    <>
                                        Read more <ArrowForwardIcon />
                                    </>
                                </a>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
};

export default PlantExtraInfo;
