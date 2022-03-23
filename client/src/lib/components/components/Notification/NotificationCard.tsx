import React from "react";
import { ExternalLinkIcon, MoonIcon, PhoneIcon, ViewIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { useStore } from "lib/store/store";

type Icon = "MOISTURE" | "WATER_LEVEL" | "TEMPERATURE" | "HUMIDITY";
interface NotificationProps {
    plantName?: string;
    label: string;
    icon: Icon;
    date: string; 
}

const NotificationMeta = (props: NotificationProps) => {
    return (
        <Box>
            <Box
                mt='1'
                fontWeight='semibold'
                as='h4'
                lineHeight='tight'
                isTruncated
            >
                {`${props.plantName ? props.plantName + " - " : ""}${props.label}`}
            </Box>

            <Box 
                display='flex' 
                alignItems='baseline'
                width={"100%"}
            >
                <Box
                color='gray.500'
                fontWeight='semibold'
                letterSpacing='wide'
                fontSize='xs'
                textTransform='uppercase'
                >
                {props.date}
                </Box>
            </Box>
        </ Box>
    )
}

const ICONS = {
    MOISTURE: <PhoneIcon color="white"/>,
    WATER_LEVEL: <ViewIcon color="white"/>,
    TEMPERATURE: <MoonIcon color="white"/>,
    HUMIDITY: <ExternalLinkIcon color="white"/>
} as const;
const NotificationIcon = (props: { icon: Icon }) => {
    const IconComponent = () => ICONS[props.icon] as unknown as JSX.IntrinsicElements;

    return (
        <Center
            bgColor={"green.300"}
            borderRadius='lg' 
            height={50}
            width={50}
            mr={5}
            >
                { IconComponent() }
        </Center>
    )
}

const NotificationCard = (props: NotificationProps) => {
      return (
        <Box 
            margin={5}
            marginRight={0}
            marginLeft={0}
            width={"100%"} 
            borderWidth='1px' 
            borderRadius='lg' 
            overflow='hidden'
        >
    
          <Box 
            width={"100%"} 
            p='6'
          >
            <Box
                display={"flex"}
                alignItems="center"
            >
                <NotificationIcon icon={props.icon}/>
                <NotificationMeta {...props}/>
            </Box>
          </Box>
        </Box>
      );
}

export default NotificationCard;