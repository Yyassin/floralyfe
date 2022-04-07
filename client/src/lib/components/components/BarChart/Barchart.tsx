import { Box } from "@chakra-ui/react";
import { deepLog } from "lib/components/hooks/validate";
import { useStore } from "lib/store/store";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { barChartOptions, barChartData } from "../../../store/mock";

const dates = [
  "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
]

const BarChart = () => {
    const {
        selectedPlantID,
        notifications,
    } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        notifications: state.notifications
    }));

    const [data, setData] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);

    useEffect(() => {
      const millilitres = 5;

      const today = new Date();
      const waterEvents = (notifications[selectedPlantID] || []).filter(
        // @ts-ignore
        notification => notification.type === "WATER_EVENT"
      )

      const data = waterEvents.reduce((acc: any, event, idx) => {
        // @ts-ignore
        const day = dates[new Date(event.createdAt).getDay() - 1];
        acc[day] = acc[day] ? acc[day] + 5 : 5;
        return acc;
      }, {})

      // deepLog(data);
      setData([{
        name: "Watering Amount",
        data: Object.values(data).reverse()
      }]);
      setCategories(Object.keys(data).length ? Object.keys(data).reverse() : ["No data"]);


      // deepLog(Object.values(data)) 
      // deepLog(Object.keys(data))
    }, [notifications, selectedPlantID])

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
                    categories
                  }
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
