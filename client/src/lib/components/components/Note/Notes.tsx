import { ArrowForwardIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import { Badge, Box, Center, Flex, Heading, Image, Text, useColorMode } from "@chakra-ui/react";
import { useStore } from "lib/store/store";
import Link from "next/link";
import { useEffect } from "react";
import NoteAdd from "./NoteAdd";
import NoteList from "./NoteList";

const Notes = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { selectedPlantID, setSelectedPlantID } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        setSelectedPlantID: state.setSelectedPlantID
    }));
    
      return (
        <Box 
            p="4"
            margin={5}
            marginLeft={0}
            w={[200, 200, 350, 500, 600, 950]}
            height={350}
            borderRadius='lg' 
            overflow='hidden'
        >
            <Heading as="h2" size="md">
                Notes
            </Heading>
            <NoteAdd />
            <NoteList />
        </Box>
      );
};

export default Notes;
