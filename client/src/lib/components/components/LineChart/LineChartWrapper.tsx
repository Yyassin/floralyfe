import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { useStore } from "lib/store/store";
import BarChart from "../BarChart/Barchart";
import LineChart from "./LineChart";

const LineChartWrapper = () => {
    const { selectedPlantID, setSelectedPlantID } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        setSelectedPlantID: state.setSelectedPlantID,
    }));

    return (
        <Box>
            {/* { selectedPlantID } */}
            <Heading as="h2" size="md">
                Environmental History
            </Heading>
            <Box>
              <Box as='span' color='gray.600' fontSize='sm'>
                <Text as="b" color="green.400">(+5) More measurements</Text> since last login.
              </Box>
            </Box>
            <Box
                margin={5}
                marginLeft={0}
                w={[200, 200, 350, 500, 600, 800]}
                borderWidth='1px' 
                borderRadius='lg' 
                overflow='hidden'
            >
                <LineChart />
            </Box>
            
        </Box>
    );
};

export default LineChartWrapper;
