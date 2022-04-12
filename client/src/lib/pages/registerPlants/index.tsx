/**
 * registerPlants.ts
 *
 * Plant registration page.
 * @author Yousef
 */

import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
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
import { config } from "../../config";
import useWebSocket from "lib/components/hooks/useWebSocket";
import { GET_USER } from "lib/api/queries";
import { createQuery } from "lib/api/createQuery";
import { CREATE_PLANT } from "lib/api/queries/createPlant";
import { toastSuccess, dismissAll } from "../../components/util/toast";

const RegisterPlants = () => {
    // WebSocket connection
    const ws = useWebSocket(config.WS_URL, 5, 1500);
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { addPlant, angle, user, plants, setUser, cameraEncoded } = useStore(
        (state) => ({
            addPlant: state.addPlant,
            user: state.user,
            resetPlants: state.resetPlants,
            plants: state.plants,
            setUser: state.setUser,
            cameraEncoded: state.cameraEncoded,
            angle: state.angle,
        })
    );
    const initialRef = useRef<any>();

    // Form state persistence
    const [imageUrl, setImageUrl] = useState("");
    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [channel, setChannel] = useState(1);
    const [soilMoisture, setSoilMoisture] = useState(0);
    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [wiki, setWiki] = useState("");
    const [description, setDescription] = useState("");
    const [plantRecognitionAPIFlag, setPlantRecognitionAPIFlag] =
        useState(false);

    // If user isn't authenticated, redirect back to login.
    useEffect(() => {
        if (!user) router.push("/login");
    }, []);

    /**
     * Registers the currently specified plant.
     */
    const register = async () => {
        // Open the registration modal
        onOpen();

        // Abort if we already called the recogition 
        // API and haven't registerd yet.
        if (plantRecognitionAPIFlag) return;

        // Timeout to wait for recognition response.
        const tid = setTimeout(() => {
            setPlantRecognitionAPIFlag(true);
        }, 3000);

        // Invoke the plant recognition API and persist the response.
        const url = `data:image/png;base64,${cameraEncoded}`.replace(
            /(\r\n|\n|\r)/gm,
            ""
        );

        const data: any = await identifyPlant(url);
        clearTimeout(tid);
        const details = data.suggestions[0].plant_details;

        const common = details.common_names[0];
        const scientific = details.scientific_name;
        const wikiLink = details.url;
        const description = details.wiki_description;

        // deepLog("GOT RECOGNITION DATA");
        // deepLog(common);
        // deepLog(scientific);
        // deepLog(wikiLink);
        // deepLog(description);

        setName(common);
        setSpecies(scientific);
        setWiki(wikiLink);
        setDescription(description.value);
        deepLog(`Querying db for plant vitals matching species: ${scientific}`);
        setPlantRecognitionAPIFlag(true);
    };

    /**
     * Confirms plant registration with
     * the current persisted plant data.
     */
    const confirm = async () => {
        // Dismiss all toasts (if any)
        dismissAll();

        // Close the modal
        onClose();
        deepLog("REGISTER PLANT");

        // Create a plant on the database
        const response = await createQuery(CREATE_PLANT, {
            name,
            species,
            cameraAngle: angle,
            optima: {
                soilMoisture: soilMoisture / 100,
                temperature,
                humidity: humidity / 100,
            },
            ownerID: user?.id,
        });
        deepLog(response);

        // Send a plant creation message to device
        // so it may register the plant on the local database.
        const msg = {
            topic: "register-plant",
            ...response.data.createPlant,
            channel,
        };

        ws.send({
            topic: "camera-topic",
            userID: user?.id,
            payload: {
                ...msg,
            },
        });

        // Display registration toast.
        toastSuccess("Registered Plant.");

        // Add the plant to state
        addPlant({
            ...msg,
            wiki: null,
            description: null,
        });

        // Reset form
        setPlantRecognitionAPIFlag(false);
        setName("");
        setSpecies("");
        setChannel(2);
        setSoilMoisture(0);
        setHumidity(0);
        setTemperature(0);
    };

    /**
     * Refetch user until they've logged into their device
     * and paired.
     */
    const refetchUser = async () => {
        const { data } = await createQuery(GET_USER, {
            email: user!.email,
            password: user!.password,
        });
        const { users: newUser } = data;

        if (newUser?.deviceID) {
            setUser(newUser);
        }
    };

    /**
     * Sends subscription request to user's device id.
     */
    useEffect(() => {
        const subscriptionMessage = {
            topic: "subscribe",
            payload: {
                deviceID: user?.deviceID,
            },
        };
        ws.send(subscriptionMessage);
    });

    return (
        user && (
            <Center display={"flex"} flexDirection={"column"}>
                {!user.deviceID ? (
                    <Center
                        margin={5}
                        mt={75}
                        marginLeft={0}
                        width={500}
                        height={350}
                    >
                        <Flex flexDirection={"column"}>
                            Please register/login on your device.
                            <Button
                                marginTop={5}
                                bg={"green.400"}
                                color={"white"}
                                _hover={{
                                    bg: "green.500",
                                }}
                                onClick={() => refetchUser()}
                            >
                                Refresh
                            </Button>
                        </Flex>
                    </Center>
                ) : (
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
                            <Flex justifyContent={"space-between"}>
                                <CameraFeed url={imageUrl} />
                            </Flex>
                        </Box>
                        <img
                            onError={(e) => (e.currentTarget.src = "")}
                            crossOrigin="anonymous"
                            id="plant-img"
                            style={{ display: "none" }}
                            src={imageUrl}
                        />
                        <Stack spacing={10} margin={10}>
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
                                {!plantRecognitionAPIFlag ? (
                                    <Text as="i" ml={6}>
                                        Loading...
                                    </Text>
                                ) : (
                                    <>
                                        <Text as="i" ml={6}>
                                            We've recommended some fields for
                                            you.
                                        </Text>
                                        <ModalCloseButton />
                                        <ModalBody pb={6}>
                                            <FormControl>
                                                <FormLabel>Name</FormLabel>
                                                <Input
                                                    ref={initialRef}
                                                    placeholder="Name"
                                                    value={name}
                                                    onChange={(evt) =>
                                                        setName(
                                                            evt.target.value
                                                        )
                                                    }
                                                />
                                            </FormControl>

                                            <FormControl mt={4}>
                                                <FormLabel>Species</FormLabel>
                                                <Input
                                                    placeholder="Species"
                                                    value={species}
                                                    onChange={(evt) =>
                                                        setSpecies(
                                                            evt.target.value
                                                        )
                                                    }
                                                />
                                            </FormControl>

                                            <FormControl mt={4}>
                                                <FormLabel htmlFor="channel">
                                                    Channel
                                                </FormLabel>
                                                <Select
                                                    id="channel"
                                                    placeholder="Select channel"
                                                    value={channel}
                                                    onChange={(evt) =>
                                                        setChannel(
                                                            parseInt(
                                                                evt.target.value
                                                            )
                                                        )
                                                    }
                                                >
                                                    <option value={1}>
                                                        Channel 1
                                                    </option>
                                                    <option value={2}>
                                                        Channel 2
                                                    </option>
                                                </Select>
                                            </FormControl>

                                            <FormLabel mt={4}>Optima</FormLabel>
                                            <FormControl>
                                                <FormLabel htmlFor="mositure">
                                                    Soil Moisture
                                                </FormLabel>
                                                <NumberInput
                                                    defaultValue={0}
                                                    max={100}
                                                    min={0}
                                                    keepWithinRange={true}
                                                    clampValueOnBlur={true}
                                                    value={soilMoisture}
                                                    onChange={(value) =>
                                                        setSoilMoisture(
                                                            parseFloat(value)
                                                        )
                                                    }
                                                >
                                                    <NumberInputField />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </FormControl>

                                            <FormControl mt={4}>
                                                <FormLabel htmlFor="temperature">
                                                    Temperature
                                                </FormLabel>
                                                <NumberInput
                                                    defaultValue={0}
                                                    max={100}
                                                    min={0}
                                                    keepWithinRange={true}
                                                    clampValueOnBlur={true}
                                                    value={temperature}
                                                    onChange={(value) =>
                                                        setTemperature(
                                                            parseFloat(value)
                                                        )
                                                    }
                                                >
                                                    <NumberInputField />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </FormControl>

                                            <FormControl mt={4}>
                                                <FormLabel htmlFor="humidity">
                                                    Humidity
                                                </FormLabel>
                                                <NumberInput
                                                    defaultValue={0}
                                                    max={100}
                                                    min={0}
                                                    keepWithinRange={true}
                                                    clampValueOnBlur={true}
                                                    value={humidity}
                                                    onChange={(value) =>
                                                        setHumidity(
                                                            parseFloat(value)
                                                        )
                                                    }
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
                                            <Button
                                                onClick={() => confirm()}
                                                colorScheme="green"
                                                mr={3}
                                            >
                                                Register
                                            </Button>
                                            <Button onClick={onClose}>
                                                Cancel
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                    </Center>
                )}
            </Center>
        )
    );
};

export default RegisterPlants;
