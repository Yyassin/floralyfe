import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { Component } from "react";
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { lineChartData, lineChartOptions } from "../../../store/mock";


class LineChart extends Component {
  constructor(props: any) {
    super(props);

    this.state = {
        options: lineChartOptions,
        series: lineChartData
      };
  }

  render() {
    return (
        <Box
        borderWidth='1px' 
        borderRadius='lg'
        height="100%"
        width="100%"
        overflow='hidden'
        // bgGradient={"linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"}
        position={"relative"}
      >
        <Chart
            //@ts-ignore
            options={this.state.options}
            //@ts-ignore
            series={this.state.series}
            type="area"
            width="100%"
        />
    </ Box>
    );
  }
}

export default LineChart;