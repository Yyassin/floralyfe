/**
 * VitalsCollection.tsx
 *
 * Renders live vitals and bar chart
 * for automatic irrigation.
 * @author Yousef
 */

import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import BarChart from "../BarChart/Barchart";
import VitalsTelemetry from "./VitalsTelemetry";

const VitalsCollection = () => {
    return (
        <Box>
            <Box
                margin={5}
                marginLeft={0}
                w={[200, 200, 350, 500, 600, 950]}
                height={300}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
            >
                <BarChart />
            </Box>

            <Heading as="h2" size="md" mb={5}>
                Automatic Irrigation (ml)
            </Heading>
            <Box>
                <Box as="span" color="gray.600" fontSize="sm">
                    {/* <Text as="b" color="green.400">(+13) irrigation events</Text> in the last week. */}
                </Box>
            </Box>

            <VitalsTelemetry />
        </Box>
    );
};

export default VitalsCollection;
