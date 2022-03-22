import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { Component } from "react";
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { barChartOptions, barChartData } from "../../../store/mock";


class BarChart extends Component {
  constructor(props: any) {
    super(props);

    this.state = {
      options: barChartOptions,
      series: barChartData
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
        bgGradient={"linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"}
        position={"relative"}
      >
        <Chart
            //@ts-ignore
            options={this.state.options}
            //@ts-ignore
            series={this.state.series}
            type="bar"
            width="100%"
            height="100%"
        />
    </ Box>
    );
  }
}

export default BarChart;