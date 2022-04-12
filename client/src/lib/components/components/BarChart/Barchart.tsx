/**
 * Barchart.tsx
 *
 * Displays a bar chart to log plant
 * watering amount per day of week.
 */

import { Box } from "@chakra-ui/react";
import { useStore } from "lib/store/store";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { barChartOptions, barChartData } from "../../../store/mock";

// Days of the week
const dates = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const BarChart = () => {
    // Fetch all notifications
    const { selectedPlantID, notifications } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        notifications: state.notifications,
    }));

    const [data, setData] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);

    // Format the data to be displayed
    useEffect(() => {
        const millilitres = 5;

        // Filter notifications for all water events
        const waterEvents = (notifications[selectedPlantID] || []).filter(
            // @ts-ignore
            (notification) => notification.type === "WATER_EVENT"
        );

        // Process water events and accumulate them into bins based on day.
        const data = waterEvents.reduce((acc: any, event, idx) => {
            // @ts-ignore
            const day = dates[new Date(event.createdAt).getDay() - 1];
            acc[day] = acc[day] ? acc[day] + millilitres : millilitres;
            return acc;
        }, {});

        // Set the bar graph data to processed notifications
        setData([
            {
                name: "Watering Amount",
                data: Object.values(data).reverse(),
            },
        ]);
        setCategories(
            Object.keys(data).length ? Object.keys(data).reverse() : ["No data"]
        );

        // deepLog(Object.values(data))
        // deepLog(Object.keys(data))
    }, [notifications, selectedPlantID]);

    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            height="100%"
            width="100%"
            overflow="hidden"
            bgGradient={
                "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
            }
            position={"relative"}
        >
            <Chart
                //@ts-ignore
                options={{
                    ...barChartOptions,
                    xaxis: {
                        ...barChartOptions.xaxis,
                        categories,
                    },
                }}
                //@ts-ignore
                series={data}
                type="bar"
                width="100%"
                height="100%"
            />
        </Box>
    );
};

export default BarChart;
