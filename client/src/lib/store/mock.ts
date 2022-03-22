import { PlantCardProps } from "lib/components/components/PlantCard/PlantCard";

export const user = {
    firstName: "Yousef",
    lastName: "Yassin",
    email: "yousefyassin@cmail.carleton.ca",
};

export const plantVitals: any = {
    aloe: {
        temperature: 23,
        moisture: 33,
        humidity: 67,
        light: 56,
        growth: 30,
    },
    lemon: {
        temperature: 23,
        moisture: 53,
        humidity: 67,
        light: 56,
        growth: 50,
    },
};

export const plantData: PlantCardProps[] = [
    {
        name: "Aloe",
        species: "Aloe Vera",
        notificationCount: 5,
        health: true,
        channel: 1,
        id: "aloe",
        vitals: {
            waterFillEvents: 15,
        },
    },
    {
        name: "Lemon",
        species: "Citrullus lanatus",
        notificationCount: 19,
        health: false,
        channel: 2,
        id: "lemon",
        vitals: {
            waterFillEvents: 9,
        },
    },
];

export const barChartData = [
    {
        name: "Sales",
        data: [330, 250, 110, 300, 490, 350, 270, 130, 425],
    },
];

export const barChartOptions = {
    chart: {
        toolbar: {
            show: false,
        },
    },
    tooltip: {
        style: {
            backgroundColor: "red",
            fontSize: "12px",
            fontFamily: undefined,
        },
        onDatasetHover: {
            style: {
                backgroundColor: "red",
                fontSize: "12px",
                fontFamily: undefined,
            },
        },
        theme: "dark",
    },
    xaxis: {
        categories: [
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        show: true,
        labels: {
            show: true,
            style: {
                colors: "#fff",
                fontSize: "12px",
            },
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        show: true,
        color: "#fff",
        labels: {
            show: true,
            style: {
                colors: "#fff",
                fontSize: "14px",
            },
        },
    },
    grid: {
        show: false,
    },
    fill: {
        colors: "#fff",
    },
    dataLabels: {
        enabled: false,
    },
    plotOptions: {
        bar: {
            borderRadius: 8,
            columnWidth: "12px",
        },
    },
    responsive: [
        {
            breakpoint: 768,
            options: {
                plotOptions: {
                    bar: {
                        borderRadius: 0,
                    },
                },
            },
        },
    ],
};

export const lineChartData = [
    {
        name: "Temperature",
        data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
    },
    {
        name: "Humidity",
        data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
    },
    {
        name: "Moisture",
        data: [10, 20, 30, 40, 30, 20, 10, 20, 30],
    },
    {
        name: "Growth",
        data: [90, 90, 40, 100, 20, 0, 40, 10, 20],
    },
];

export const lineChartOptions = {
    chart: {
        toolbar: {
            show: false,
        },
    },
    tooltip: {
        theme: "dark",
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "smooth",
    },
    xaxis: {
        categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        labels: {
            style: {
                colors: "#c8cfca",
                fontSize: "12px",
            },
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: "#c8cfca",
                fontSize: "12px",
            },
        },
    },
    legend: {
        show: true,
    },
    grid: {
        strokeDashArray: 5,
    },
    fill: {
        type: "gradient",
        gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.5,
            gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
            inverseColors: true,
            opacityFrom: 0.8,
            opacityTo: 0,
            stops: [],
        },
        colors: ["#4FD1C5", "#2D3748", "#4299e1", "#68D391"],
    },
    colors: ["#4FD1C5", "#2D3748", "#4299e1", "#68D391"],
};

export const auth = true;

export const notifications = {
    "aloe": [
        {
            label: "Dry Air",
            icon: "HUMIDITY",
            date: new Date("05 October 2011 14:48 UTC").toString(),
        },
        {
            label: "Watering Soil",
            icon: "MOISTURE",
            date: new Date("05 October 2011 14:48 UTC").toString(),
        },
        {
            label: "Dry Soil",
            icon: "MOISTURE",
            date: new Date("05 October 2011 14:48 UTC").toString(),
        },
        {
          label: "Water Tank Empty",
          icon: "WATER_LEVEL",
          date: new Date("05 October 2011 14:48 UTC").toString(),
      },
      {
          label: "Dry Air",
          icon: "HUMIDITY",
          date: new Date("05 October 2011 14:48 UTC").toString(),
      },
    ],
    
    "lemon": [
        {
            label: "Cold Temperature",
            icon: "TEMPERATURE",
            date: new Date("05 October 2011 14:48 UTC").toString(),
        },
        {
            label: "Water Tank Empty",
            icon: "WATER_LEVEL",
            date: new Date("05 October 2011 14:48 UTC").toString(),
        },
        {
            label: "Dry Air",
            icon: "HUMIDITY",
            date: new Date("05 October 2011 14:48 UTC").toString(),
        },
    ],
};
