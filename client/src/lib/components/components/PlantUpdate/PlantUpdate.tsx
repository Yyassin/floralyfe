import React from "react";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import { Badge, Box, Center, Flex, Heading, Image, Text, useColorMode } from "@chakra-ui/react";
import { useStore } from "lib/store/store";
import { useEffect } from "react";
import CameraFeed from "../CameraFeed/CameraFeed";
import { deepLog } from "lib/components/hooks/validate";

const PlantUpdate = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { selectedPlantID, plants } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        plants: state.plants
    }));

    const plant = plants[selectedPlantID];
    
      return (
        <Box 
            margin={5}
            marginLeft={0}
            width={1100}
            height={350} 
            borderWidth='1px' 
            borderRadius='lg' 
            overflow='hidden'
        >
            
    
            <Flex
                justifyContent={"space-between"}
            >
                <Box
                    p="4"
                >
                    <Box>
                        <Box as='span' color='gray.600' fontSize='sm'>
                            <Text as="i">{plant.species}</Text>
                        </Box>
                    </Box>
                    <Heading as="h4" fontSize={20}>
                        Here's an update on your plant, {plant.name}!
                    </Heading>
                    <Box>
                        <Box 
                            as='span' 
                            color='gray.600' 
                            fontSize='sm'
                        >
                            <Text
                                mt={3}
                                fontSize={17}
                            >
                                {plant.name} is in excellent condition and has been growing smoothly since your last login. 
                                They've been well hydrated in that time with 13 distinct watering events totalling to 50ml of water. 
                                All other vitals have been in check with only 2 critical notifications since the last login.
                            </Text>
                        </Box>
                    </Box>
                </Box>
                <CameraFeed url={plant.image}/>
            </Flex>
        </Box>
      );
};

export default PlantUpdate;
