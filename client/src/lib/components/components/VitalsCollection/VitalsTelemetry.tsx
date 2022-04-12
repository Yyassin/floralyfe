/**
 * VitalsTelemetry.tsx
 *
 * Renders collection of live vitals
 * with according icons and their values.
 * @author Yousef
 */

import { Flex, Text } from "@chakra-ui/react";
import { useStore } from "lib/store/store";
import React, { useRef } from "react";
import VitalStatistic from "../VitalStatistic/VitalStatistics";

const VitalsTelemetry = () => {
    const { selectedPlantID, vitals } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        vitals: state.vitals,
        addPersistedVital: state.addPersistedVital,
        setLiveVital: state.setLiveVital,
        loadVitals: state.loadVitals,
    }));

    const plantVitals = vitals[selectedPlantID]; // Make this selected plant id eventually
    const live: any = plantVitals?.live;

    /**
     * Formats live vital measurements to be displayed
     * according to vital type.
     * @param name string, the vital name.
     * @param value any, the vital value.
     * @returns string, the formatted display string.
     */
    const formatVital = (name: string, value: any) => {
        switch (name) {
            case "temperature": {
                return `${value.toFixed(2)} C`;
            }

            case "airHumidity": {
                return `${value.toFixed(2)}%`;
            }

            default:
                return `${(value * 100).toFixed(2)}%`;
        }
    };

    return (
        <Flex flexDir={"column"}>
            <Flex>
                {!live ? (
                    <Text>No vitals received</Text>
                ) : (
                    Object.keys(live || []).map(
                        (vital: any, idx: number) =>
                            typeof live[vital] === "number" && (
                                <VitalStatistic
                                    key={`selectedPlantID-${idx}`}
                                    name={vital}
                                    value={formatVital(vital, live[vital])}
                                    percentage={live[vital]}
                                />
                            )
                    )
                )}
            </Flex>
        </Flex>
    );
};

export default VitalsTelemetry;
