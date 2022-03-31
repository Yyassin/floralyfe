import { Button, Flex, Text } from "@chakra-ui/react";
import { deepLog } from "lib/components/hooks/validate";
import { Vital } from "lib/store/slices/vitalSlice";
import { useStore } from "lib/store/store";
import dynamic from "next/dynamic";
import React, { Component, useRef } from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import {
    getDayOffset,
    lineChartData,
    lineChartOptions,
    plantVitals,
} from "../../../store/mock";
import VitalStatistic from "../VitalStatistic/VitalStatistics";

const VitalsTelemetry = () => {
    const counter = useRef(0);
    const { selectedPlantID, vitals, addPersistedVital, setLiveVital, loadVitals } =
        useStore((state) => ({
            selectedPlantID: state.selectedPlantID,
            vitals: state.vitals,
            addPersistedVital: state.addPersistedVital,
            setLiveVital: state.setLiveVital,
            loadVitals: state.loadVitals
        }));

    const plantVitals = vitals[selectedPlantID];
    const live: any = plantVitals?.live

    const getRandomInt = (max: number) => {
        return Math.floor(Math.random() * max);
      }

    const clearVitals = () => {
        loadVitals(selectedPlantID, [])
        setLiveVital({plantID: selectedPlantID} as any)
    };

    const updateLiveVital = () => {
        const vital: Vital = {
            id: selectedPlantID,
            plantID: selectedPlantID,
            critical: getRandomInt(2) > 0,
            temperature: getRandomInt(100) / 100,
            humidity: getRandomInt(100) / 100,
            moisture: getRandomInt(100) / 100,
            light: getRandomInt(100) / 100,
            greenGrowth: getRandomInt(100) / 100,
            date: getDayOffset(counter.current).toString(),
        }
        deepLog("NEW LIVE VITAL")
        deepLog(vital)
        setLiveVital(vital)
        counter.current += getRandomInt(5);
    };

    const addVital = () => {
        const vital: Vital = {
            id: selectedPlantID,
            plantID: selectedPlantID,
            critical: getRandomInt(1) > 0,
            temperature: getRandomInt(100) / 100,
            humidity: getRandomInt(100) / 100,
            moisture: getRandomInt(100) / 100,
            light: getRandomInt(100) / 100,
            greenGrowth: getRandomInt(100) / 100,
            date: getDayOffset(counter.current).toString(),
        }

        deepLog("RECEIVED PERIODIC VITAL");
        deepLog(vital)

        addPersistedVital(vital);
        counter.current += 2 + getRandomInt(5);
    };

    const loadVitalsWrapper = () => {
        for (let i = 0; i < 100; i++) {
            addVital()
        }
    }

    return (
        <Flex 
            flexDir={"column"}
        >
            <Flex>
                <Button mr={5} onClick={clearVitals}>
                    Clear Vitals
                </Button>
                <Button mr={5} onClick={updateLiveVital}>
                    updateLiveVital
                </Button>
                <Button mr={5} onClick={addVital}>
                    AddVital
                </Button>
                <Button mr={5} onClick={loadVitalsWrapper}>
                    Add Many Vitals
                </Button>
            </Flex>
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
                                value={`${(live[vital] * 100).toFixed(2)}%`}
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
