import { StarIcon } from "@chakra-ui/icons";
import { Badge, Box, Image, Text, useColorMode } from "@chakra-ui/react";
import { useStore } from "lib/store/store";
import { useEffect } from "react";

export interface PlantCardProps {
    health: boolean;
    name: string;
    species: string;
    notificationCount: number;
    channel: number;
    id: string;
    vitals: {
        waterFillEvents: number
    }
}

const PlantCard = (props: PlantCardProps) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { selectedPlantID, setSelectedPlantID } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        setSelectedPlantID: state.setSelectedPlantID
    }));
    const selected = (props.id === selectedPlantID);

      const gradient = (colorMode === "light") ? "linear(to-br, green.200, white)" : "linear(to-br, green.800, gray.900)"; 
    
      return (
        <Box 
            margin={5}
            marginLeft={0}
            width={700} 
            maxW='md' 
            borderWidth='1px' 
            borderRadius='lg' 
            overflow='hidden'
            bgGradient={selected ? gradient : ""}
            onClick={() => setSelectedPlantID(props.id)}
        >
    
          <Box p='6'>
            <Box display='flex' alignItems='baseline'>
              <Badge borderRadius='full' px='2' colorScheme={props.health ? "green" : "yellow"}>
                {props.health ? "optimal" : "critical"}
              </Badge>
              <Box
                color='gray.500'
                fontWeight='semibold'
                letterSpacing='wide'
                fontSize='xs'
                textTransform='uppercase'
                ml='2'
              >
                Connected to channel {props.channel}
              </Box>
            </Box>
    
            <Box
              mt='1'
              fontWeight='semibold'
              as='h4'
              lineHeight='tight'
              isTruncated
            >
              {props.name}
            </Box>

            <Box>
              <Box as='span' color='gray.600' fontSize='sm'>
                <Text as="i">{props.species}</Text>
              </Box>
            </Box>
    
            <Box display='flex' mt='2' alignItems='center'>
              <Box as='span' color='gray.600' fontSize='sm'>
                + {props.notificationCount} Notifications
              </Box>
            </Box>
          </Box>
        </Box>
      );
};

export default PlantCard;
