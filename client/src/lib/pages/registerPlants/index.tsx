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

const RegisterPlants = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = useRef<any>();

    return (
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
                    <CameraFeed />
                </Flex>
            </Box>
            <Stack spacing={10} margin={10}>
                <Button
                    bg={"green.400"}
                    color={"white"}
                    _hover={{
                        bg: "green.500",
                    }}
                    width={300}
                    onClick={onOpen}
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
                    <Text as="i" ml={6}>
                        We've recommended some fields for you.
                    </Text>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input ref={initialRef} placeholder="Name" />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Species</FormLabel>
                            <Input placeholder="Last name" />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel htmlFor="channel">Channel</FormLabel>
                            <Select id="channel" placeholder="Select channel">
                                <option>Channel 1</option>
                                <option>Channel 2</option>
                            </Select>
                        </FormControl>

                        <FormLabel>Optima</FormLabel>
                        <FormControl mt={4}>
                            <FormLabel htmlFor="channel">Soil Moisture</FormLabel>
                            <NumberInput
                                defaultValue={0}
                                max={100}
                                min={0}
                                keepWithinRange={true}
                                clampValueOnBlur={true}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel htmlFor="channel">Temperature</FormLabel>
                            <NumberInput
                                defaultValue={0}
                                max={100}
                                min={0}
                                keepWithinRange={true}
                                clampValueOnBlur={true}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel htmlFor="channel">Humidity</FormLabel>
                            <NumberInput
                                defaultValue={0}
                                max={100}
                                min={0}
                                keepWithinRange={true}
                                clampValueOnBlur={true}
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
                        <Button onClick={onClose} colorScheme="green" mr={3}>
                            Register
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Center>
    );
};

export default RegisterPlants;
