import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"
import { Box, Center, Flex } from "@chakra-ui/react"
import styles from "./CameraFeed.module.scss"

const CameraFeed = () => {
    return (
        <Box
            width={2000}
            height={350}
            backgroundImage="linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.0)), url('https://www.almanac.com/sites/default/files/styles/large/public/image_nodes/aloe-vera-white-pot_sunwand24-ss_edit.jpg?itok=6dE5RWDP')"
            backgroundPosition={"center"}
            backgroundRepeat="no-repeat"
            backgroundSize={"cover"}
            objectFit={"cover"}
            position={"relative"}
            className={styles.camera_feed}
        >
            <Flex
                justifyContent={"space-between"}
                className="plant-update-arrows"
            >
                <Center
                    width={"20%"}
                    height={350}
                    backgroundImage={"linear-gradient(90deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.0))"}
                    className="plant-update-arrow-panel"
                    onClick={() => console.log("turn camera left msg")}
                >
                    <ChevronLeftIcon 
                        color="white"
                        w={200}
                        h={50}
                    />
                </Center>
                <Center
                    width={"20%"}
                    height={350}
                    backgroundImage={"linear-gradient(-90deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.0))"}
                    className="plant-update-arrow-panel"
                    onClick={() => console.log("turn camera right msg")}
                >
                    <ChevronRightIcon
                        color="white"
                        w={200}
                        h={50}
                    />
                </Center>
            </Flex>
        </Box>
    )
}

export default CameraFeed;