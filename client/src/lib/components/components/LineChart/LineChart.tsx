import { Box } from "@chakra-ui/react";
import { deepLog } from "lib/components/hooks/validate";
import { useStore } from "lib/store/store";
import dynamic from "next/dynamic";
import React, { Component, useEffect, useState } from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { barChartOptions, lineChartData, lineChartOptions } from "../../../store/mock";

const LineChart = () => {
    const { selectedPlantID, vitals } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        vitals: state.vitals,
    }));

    const [data, setData] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);

    useEffect(() => {
        const persisted = vitals[selectedPlantID]?.persisted;    // Use selected id
        //deepLog(persisted);

        const data = !persisted ? [] : persisted.reduce(
            (acc: any, dp, idx) => {
                acc.temperature.push((dp.temperature).toFixed(3));
                acc.humidity.push((dp.airHumidity).toFixed(3));
                acc.moisture.push((dp.soilMoisture * 100).toFixed(3));
                acc.growth.push((dp.greenGrowth * 100).toFixed(3));

                // @ts-ignore
                const date = new Date(dp.createdAt);    

                acc.dates.push(
                  `${date.getMonth() + 1}/${date.getDay()}/${date.getFullYear()}:${date.getHours() + 1}`
                );
                return acc;
            },
            {
                temperature: [],
                humidity: [],
                moisture: [],
                growth: [],
                dates: [],
            }
        );

        const lineChartData = [
            {
                name: "Temperature",
                data: data.temperature,
            },
            {
                name: "Humidity",
                data: data.humidity,
            },
            {
                name: "Moisture",
                data: data.moisture,
            },
            {
                name: "Growth",
                data: data.growth,
            },
        ];
        setData(lineChartData)
        setCategories(data.dates ? data.dates : ["No data"]);
    }, [vitals, selectedPlantID]);
    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            height="100%"
            width="100%"
            overflow="hidden"
            // bgGradient={"linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"}
            position={"relative"}
        >
            <Chart
                //@ts-ignore
                options={{
                  ...lineChartOptions,
                  xaxis: {
                    ...lineChartOptions.xaxis,
                    categories
                  }
                }}
                //@ts-ignore
                series={data}
                type="area"
                width="100%"
            />
        </Box>
    );
};

export default LineChart;
