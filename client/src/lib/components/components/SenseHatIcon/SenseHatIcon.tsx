/**
 * SenseHatIcon.tsx
 *
 * Renders a SenseHat icon button to toggle
 * between sense hat icons.
 * @author Yousef
 */

import React from "react";
import { Box, Center, Flex } from "@chakra-ui/react";
import { useStore } from "lib/store/store";
import { useState } from "react";
import useWebSocket from "lib/components/hooks/useWebSocket";
import { config } from "lib/config";
import { BsDropletFill, BsWater } from "react-icons/bs";
import { FaTemperatureLow } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { RiEmotionHappyLine } from "react-icons/ri";

// All supported icons
const ICONS = {
    HAPPY: <RiEmotionHappyLine color="white" fontSize={30} />,
    MOISTURE: <BsDropletFill color="white" fontSize={30} />,
    WATER_LEVEL: <BsWater color="white" fontSize={30} />,
    TEMPERATURE: <FaTemperatureLow color="white" fontSize={30} />,
    HUMIDITY: <WiHumidity color="white" fontSize={40} />,
} as const;

/**
 * Renders the specified icon.
 * @param icon string, the tag of the icon to render.
 * @returns the icon.
 */
const IconImage = (icon: string) => {
    //@ts-ignore
    const IconComponent = () => ICONS[icon] as unknown as JSX.IntrinsicElements;

    return (
        <Center bgColor={"green.300"} borderRadius="lg" height={50} width={50}>
            {IconComponent()}
        </Center>
    );
};

/**
 * Renders a button to display and toggle
 * between SenseHat icons.
 * @returns the button.
 */
const SenseHatIcon = () => {
    const ws = useWebSocket(config.WS_URL, 5, 1500);
    const { user, senseIcon, setSenseIcon } = useStore((state) => ({
        user: state.user,
        senseIcon: state.senseIcon,
        setSenseIcon: state.setSenseIcon,
    }));

    const [idx, setIdx] = useState(0);

    /**
     * Increments index to toggle between icons in
     * ICONs.
     */
    const incrementIdx = () => {
        const newIdx = (idx + 1) % Object.keys(ICONS).length;
        setIdx(newIdx);

        const icon = Object.keys(ICONS)[newIdx];

        const msg = {
            topic: "vitals-topic",
            userID: user?.id,
            payload: {
                topic: "sensehat-icon-topic",
                icon: Object.keys(ICONS)[newIdx],
            },
        };

        ws.send(msg);
        setSenseIcon(icon);
    };

    return (
        <Box
            margin={5}
            marginLeft={0}
            width={200}
            height={70}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            _hover={{ bg: "gray.200" }}
            cursor={"pointer"}
            onClick={() => incrementIdx()}
            role="sense-wrapper"
        >
            <Box p="3">
                <Flex justifyContent={"space-between"}>
                    <Box>
                        <Box display="flex" alignItems="baseline">
                            <Box
                                color="gray.500"
                                fontWeight="semibold"
                                letterSpacing="wide"
                                fontSize="xs"
                                textTransform="uppercase"
                            >
                                SenseHat Icon
                            </Box>
                        </Box>

                        <Box
                            mt="1"
                            fontWeight="semibold"
                            as="h4"
                            lineHeight="tight"
                            isTruncated
                            role="sense-state"
                        >
                            {senseIcon}
                        </Box>
                    </Box>
                    {IconImage(senseIcon)}
                </Flex>
            </Box>
        </Box>
    );
};

export default SenseHatIcon;
