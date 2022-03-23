import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { identifyPlant, toBase64 } from "lib/api/plantId";
import LineChartWrapper from "lib/components/components/LineChart/LineChartWrapper";
import ManualIrrigation from "lib/components/components/ManualIrrigation/ManualIrrigation";
import Notes from "lib/components/components/Note/Notes";
import Notification from "lib/components/components/Notification/Notifications";
import PlantExtraInfo from "lib/components/components/PlantExtraInfo/PlantExtraInfo";
import PlantUpdate from "lib/components/components/PlantUpdate/PlantUpdate";
import SenseHatIcon from "lib/components/components/SenseHatIcon/SenseHatIcon";
import VitalsCollection from "lib/components/components/VitalsCollection/VitalsCollection";
import { user } from "lib/store/mock";
import { useEffect } from "react";
import styles from "./Home.module.scss";
import { useStore } from "lib/store/store";
import { useRouter } from "next/router";
import PlantCard from "lib/components/components/PlantCard/PlantCard";

const Home = () => {
    const router = useRouter();
    const { user, plants, selectedPlantID } = useStore((state) => ({
        user: state.user,
        plants: state.plants,
        selectedPlantID: state.selectedPlantID
    }));

    useEffect(() => {
        if (!user) router.push("/login");
        else if (!Object.keys(plants).length) router.push("/registerplants");
    }, [])

    return (user && Object.keys(plants).length && 
        <div className={styles.home_wrapper}>
            <Box
                margin={5}
            >
                <Heading as="h1" size="md" paddingTop={5}>
                    Welcome back, {user?.firstName}
                </Heading>
                <Flex
                    justifyContent={"space-between"}
                >
                    <Flex>
                        { Object.keys(plants).map(plantId => <PlantCard key={plantId} {...plants[plantId]}/>) }
                    </Flex>
                    <Flex>
                        <ManualIrrigation />
                        <SenseHatIcon />
                    </Flex>
                </Flex>
                <Flex>
                    <PlantUpdate />
                    <PlantExtraInfo {...plants[selectedPlantID]}/>
                </Flex>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                        <VitalsCollection />
                        <LineChartWrapper />
                </div>
                <Flex>
                    <Notes />
                    <Notification />
                </Flex>

                
                {/* <img
                    id="plant-img"
                    src="https://s3.amazonaws.com/finegardening.s3.tauntoncloud.com/app/uploads/vg-migration/2019/09/28011137/Shishito_containers.JPG"
                    alt=""
                /> */}
            </Box>
        </div>
    );
};

export default Home;
