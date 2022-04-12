/**
 * NotificationCard.tsx
 *
 * Renders a single notification card with an
 * icon, title and data.
 * @author Yousef
 */

import React from "react";
import { Box, Center } from "@chakra-ui/react";
import { BsDropletFill, BsWater } from "react-icons/bs";
import { FaTemperatureLow } from "react-icons/fa";
import { GiPlantWatering } from "react-icons/gi";
import { WiHumidity } from "react-icons/wi";

type Icon = "MOISTURE" | "WATER_LEVEL" | "TEMPERATURE" | "HUMIDITY";
interface NotificationProps {
    plantName?: string;
    label: string;
    icon: Icon;
    date: string;
    createdAt: string;
}

/**
 * Renders the notification meta data, name,
 * label and date.
 */
const NotificationMeta = (props: NotificationProps) => {
    return (
        <Box>
            <Box
                mt="1"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated
            >
                {`${props.plantName ? props.plantName + " - " : ""}${
                    props.label
                }`}
            </Box>

            <Box display="flex" alignItems="baseline" width={"100%"}>
                <Box
                    color="gray.500"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    fontSize="xs"
                    textTransform="uppercase"
                >
                    {props.createdAt}
                </Box>
            </Box>
        </Box>
    );
};

const ICONS = {
    WATER_EVENT: <GiPlantWatering color="white" fontSize={30} />,
    MOISTURE: <BsDropletFill color="white" fontSize={30} />,
    WATER_LEVEL: <BsWater color="white" fontSize={30} />,
    TEMPERATURE: <FaTemperatureLow color="white" fontSize={30} />,
    HUMIDITY: <WiHumidity color="white" fontSize={40} />,
} as const;

/**
 * Renders the notification icon.
 */
const NotificationIcon = (props: { icon: Icon }) => {
    const IconComponent = () =>
        ICONS[props.icon] as unknown as JSX.IntrinsicElements;

    return (
        <Center
            bgColor={"green.300"}
            borderRadius="lg"
            height={50}
            width={50}
            mr={5}
        >
            {IconComponent()}
        </Center>
    );
};

/**
 * Renders the notification card.
 */
const NotificationCard = (props: NotificationProps) => {
    return (
        <Box
            margin={5}
            marginRight={0}
            marginLeft={0}
            width={"100%"}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
        >
            <Box width={"100%"} p="6">
                <Box display={"flex"} alignItems="center">
                    {
                        //@ts-ignore
                        <NotificationIcon icon={props.type} />
                    }
                    <NotificationMeta {...props} />
                </Box>
            </Box>
        </Box>
    );
};

export default NotificationCard;
