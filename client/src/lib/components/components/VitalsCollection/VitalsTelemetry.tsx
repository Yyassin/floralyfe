import { Flex } from "@chakra-ui/react";
import { useStore } from "lib/store/store";
import dynamic from "next/dynamic";
import React, { Component } from "react";
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { lineChartData, lineChartOptions, plantVitals } from "../../../store/mock";
import VitalStatistic from "../VitalStatistic/VitalStatistics";


const VitalsTelemetry = () => {
    const { selectedPlantID, setSelectedPlantID } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        setSelectedPlantID: state.setSelectedPlantID,
    }));
    return (
        <Flex
            justifyContent={"space-between"}
        >
            {
                Object.keys(plantVitals[selectedPlantID]).map((vital: any, idx: number) => (
                    <VitalStatistic 
                        key={`selectedPlantID-${idx}`} 
                        name={vital} 
                        value={`${plantVitals[selectedPlantID][vital]}%`} 
                        percentage={plantVitals[selectedPlantID][vital] / 100} />
                ))
            }
        </Flex>
    );
}

export default VitalsTelemetry;