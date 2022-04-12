/**
 * LineChartWrapper.tsx
 *
 * Wraps the line chart with a box
 * and header.
 * @author Yousef
 */

import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import LineChart from "./LineChart";

const LineChartWrapper = () => {
    return (
        <Box>
            <Heading as="h2" size="md">
                Environmental History
            </Heading>
            <Box>
                <Box as="span" color="gray.600" fontSize="sm">
                    {/* <Text as="b" color="green.400">(+5) More measurements</Text> since last login. */}
                </Box>
            </Box>
            <Box
                margin={5}
                marginLeft={0}
                w={[200, 200, 350, 500, 600, 800]}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
            >
                <LineChart />
            </Box>
        </Box>
    );
};

export default LineChartWrapper;
