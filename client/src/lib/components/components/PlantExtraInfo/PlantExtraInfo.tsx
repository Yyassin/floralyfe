import { ArrowForwardIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import { Badge, Box, Center, Flex, Heading, Image, Text, useColorMode } from "@chakra-ui/react";
import { useStore } from "lib/store/store";
import Link from "next/link";
import { useEffect } from "react";

const PlantExtraInfo = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { selectedPlantID, setSelectedPlantID } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        setSelectedPlantID: state.setSelectedPlantID
    }));
    
      return (
        <Box 
            margin={5}
            marginLeft={0}
            width={750}
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
                    width={2000}
                    height={350}
                    backgroundImage="linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.3)), url('https://cdn.hovia.com/app/uploads/Green-Tropical-Plant-Wallpaper-Mural-Plain.jpg')"
                    backgroundPosition={"center"}
                    backgroundRepeat="no-repeat"
                    backgroundSize={"cover"}
                    position={"relative"}
                >
                    <Heading 
                        as="h4" 
                        color={"white"}
                        fontSize={20}
                    >
                        More on <Text as="i">Citrullus lanatus</Text>
                    </Heading>
                    <Box>
                        <Box 
                            as='span' 
                            color='gray.300' 
                            fontSize='sm'
                        >
                            <Text
                                mt={3}
                                mb={3}
                                fontSize={17}
                            >
                                Mooni is in excellent condition and has grown 3% since your last login. They've been well hydrated
                                in that time with 13 distinct watering events totalling to 50ml of water. All other vitals
                                have been in check with only 2 critical notifications since the last login.
                            </Text>
                            <a href={"https://google.com"} target="_blank">
                                <>
                                    Read more <ArrowForwardIcon />
                                </>
                            </a>
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </Box>
      );
};

export default PlantExtraInfo;
