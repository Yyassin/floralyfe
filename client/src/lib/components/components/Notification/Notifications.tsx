import { Box, Heading } from "@chakra-ui/react";
import { notifications } from "lib/store/mock";
import { useStore } from "lib/store/store";
import NotificationCard from "./NotificationCard";

const Notifications = () => {
    const { selectedPlantID, setSelectedPlantID } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        setSelectedPlantID: state.setSelectedPlantID
    }));


    return (
        <Box
            w={[200, 200, 350, 500, 600, 900]}
            position="relative"
        >
            <Heading as="h2" size="md">
                Notifications
            </Heading>
            <Box
                height={350}
                width={"100%"}
                overflowY={"auto"}
                overflowX={"hidden"}
            >
                {((notifications as any)[selectedPlantID] as any).map((notification: any, idx: number) => (
                    <NotificationCard key={idx} {...notification}/>
                ))}
            </Box>
        </Box>
    )
}

export default Notifications;