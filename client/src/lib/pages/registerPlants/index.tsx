import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import CameraFeed from "lib/components/components/CameraFeed/CameraFeed";
import { useRef } from "react";
import ChannelTelemetry from "./ChannelTelemetry";
import { identifyPlant, toBase64 } from "lib/api/plantId";
import { useStore } from "lib/store/store";
import { deepLog } from "lib/components/hooks/validate";
import { useRouter } from "next/router";
import { config, topics } from "../../config"
import useWebSocket from "lib/components/hooks/useWebSocket";

const RegisterPlants = () => {
    const ws = useWebSocket(config.WS_URL, 5, 1500);
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { addPlant, resetPlants, user, plants } = useStore((state) => ({
        addPlant: state.addPlant,
        user: state.user,
        resetPlants: state.resetPlants,
        plants: state.plants
    }));
    const initialRef = useRef<any>();

    const [imageUrl, setImageUrl] = useState("");
    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [channel, setChannel] = useState(1);
    const [soilMoisture, setSoilMoisture] = useState(0);
    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [wiki, setWiki] = useState("");
    const [description, setDescription] = useState("");
    const [plantRecognitionAPIFlag, setPlantRecognitionAPIFlag] = useState(false);

    useEffect(() => {
        if (!user) router.push("/login");
    }, [])

    const register = async () => {
        onOpen();
        if (plantRecognitionAPIFlag) return;
        const tid = setTimeout(() => {
            setPlantRecognitionAPIFlag(true);
        }, 3000);

        const image = document.getElementById("plant-img") as HTMLImageElement;
        if (!image || !image.width) return;

        //@ts-ignore
        const data = await identifyPlant(toBase64(image));
        clearTimeout(tid);
        const details = data.suggestions[0].plant_details

        // https://cdn.harvesttotable.com/htt/2009/03/23182755/Peppers-on-vertical-wire.jpg
        // https://minnetonkaorchards.com/wp-content/uploads/2021/04/Red-Sour-Cherries.jpg

        const common = details.common_names[0];
        const scientific = details.scientific_name
        const wikiLink = details.url
        const description = details.wiki_description
        
        deepLog("GOT RECOGNITION DATA")
        deepLog(common)
        deepLog(scientific)
        deepLog(wikiLink)
        deepLog(description)

        setName(common)
        setSpecies(scientific)
        setWiki(wikiLink)
        setDescription(description.value)
        deepLog(`Querying db for plant vitals matching species: ${scientific}`)
        setPlantRecognitionAPIFlag(true);
    }
    
    const sendMsg = () => {
    const msg = { 
            id: "plant-id2",
            topic: "register-plant",
            optima: {
               temperature: 39,
               humidity: 21,
               moisture: 12,
            },
            angle: 15,
            registeredChannel: 2
        }

        // const msg = {
        //     topic: "servo-turn-plant",
        //     plantID: "plant-id"
        // }
        
        ws.send(msg, topics.CAMERA)
    }

    const confirm = () => {
        onClose();

        const plant = {
            id: name,
            name,
            species,
            channel,
            description,
            wiki,
            optima: {
                soilMoisture,
                temperature,
                humidity
            },
            image: imageUrl
        }

        deepLog("REGISTER PLANT")
        deepLog(plant)

        addPlant(plant)
        setPlantRecognitionAPIFlag(false);
        setName("");
        setSpecies("");
        setChannel(2);
        setSoilMoisture(0)
        setHumidity(0)
        setTemperature(0)
    }
    
    return (user &&
        <Center display={"flex"} flexDirection={"column"}>
            <Box
                margin={5}
                mt={75}
                marginLeft={0}
                width={500}
                height={350}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
            >
                <Flex 
                    justifyContent={"space-between"}
                >
                    <CameraFeed url={imageUrl}/>
                </Flex>
            </Box>
            <img 
                onError={e => e.currentTarget.src=""} 
                crossOrigin="anonymous"
                id="plant-img" 
                style={{display: "none"}} 
                src={imageUrl} 
            />
            <Stack spacing={10} margin={10}>
                <FormControl>
                    <FormLabel>Image Url (camera frame)</FormLabel>
                    <Input
                        type="text" 
                        placeholder="url" 
                        value={imageUrl}
                        onChange={(evt) => setImageUrl(evt.target.value)}
                    />
                </FormControl>
                <Button
                    bg={"green.400"}
                    color={"white"}
                    _hover={{
                        bg: "green.500",
                    }}
                    width={300}
                    onClick={register}
                    disabled={Object.keys(plants).length >= 2}
                >
                    Register Plant
                </Button>
                <Button
                    bg={"green.400"}
                    color={"white"}
                    _hover={{
                        bg: "green.500",
                    }}
                    width={300}
                    onClick={sendMsg} // resetPlants
                >
                    Clear Plants
                </Button>
            </Stack>
            <ChannelTelemetry />

            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Register your plant</ModalHeader>
                    {!plantRecognitionAPIFlag ? 
                    <Text as="i" ml={6}>
                        Loading...
                    </Text>
                    :
                    <>
                    <Text as="i" ml={6}>
                        We've recommended some fields for you.
                    </Text>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input 
                                ref={initialRef} 
                                placeholder="Name" 
                                value={name}
                                onChange={(evt) => setName(evt.target.value)}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Species</FormLabel>
                            <Input 
                                placeholder="Species" 
                                value={species}
                                onChange={(evt) => setSpecies(evt.target.value)}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel htmlFor="channel">Channel</FormLabel>
                            <Select 
                                id="channel" 
                                placeholder="Select channel"
                                value={channel}
                                onChange={(evt) => setChannel(parseInt(evt.target.value))}
                            >
                                <option value={1}>Channel 1</option>
                                <option value={2}>Channel 2</option>
                            </Select>
                        </FormControl>

                        <FormLabel mt={4}>Optima</FormLabel>
                        <FormControl>
                            <FormLabel htmlFor="mositure">Soil Moisture</FormLabel>
                            <NumberInput
                                defaultValue={0}
                                max={100}
                                min={0}
                                keepWithinRange={true}
                                clampValueOnBlur={true}

                                value={soilMoisture}
                                onChange={(value) => setSoilMoisture(parseFloat(value))}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel htmlFor="temperature">Temperature</FormLabel>
                            <NumberInput
                                defaultValue={0}
                                max={100}
                                min={0}
                                keepWithinRange={true}
                                clampValueOnBlur={true}
                                value={temperature}
                                onChange={(value) => setTemperature(parseFloat(value))}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel htmlFor="humidity">Humidity</FormLabel>
                            <NumberInput
                                defaultValue={0}
                                max={100}
                                min={0}
                                keepWithinRange={true}
                                clampValueOnBlur={true}

                                value={humidity}
                                onChange={(value) => setHumidity(parseFloat(value))}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => confirm()} colorScheme="green" mr={3}>
                            Register
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                    </>
                    }
                </ModalContent>
            </Modal>
        </Center>
    );
};

export default RegisterPlants;
