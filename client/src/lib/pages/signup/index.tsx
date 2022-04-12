/**
 * index.ts
 * 
 * Signup page.
 * @author Yousef
 */
import React from "react";
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { CREATE_USER } from "lib/api/queries";
import { deepLog } from "lib/components/hooks/validate";
import { createQuery } from "lib/api/createQuery";
import { toastSuccess, toastError, dismissAll } from "../../components/util/toast";

export default function SignupCard() {
    // Form persistence
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    /**
     * Signs up a user with the stored
     * form credentials.
     */
    const signUp = async () => {
        // Dismiss all toasts.
        dismissAll();
        deepLog("SIGN UP");

        const fields = [
            firstName,
            lastName,
            email,
            username,
            password
        ];

        // Ensure no empty fields.
        if (fields.includes("")) {
            deepLog(
                "At least one empty field. Retry."
            );
            toastError("At least one empty field. Retry.");
            return;
        }

        // Ensure valid email address
        const validateEmail = (email: string) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };

        if (!validateEmail(email)) {
            deepLog("Invalid email");
            toastError("Invalid email");
            return;
        }
        
        // Create the user
        const response =  await createQuery(CREATE_USER,
            {
                firstName,
                lastName,
                username,
                email,
                password
            });

        // Display sign up success
        toastSuccess("Signed up successfully.");
        //console.log(response);
        return response;
    }

    return (
        <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
        >
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"} textAlign={"center"}>
                        Sign up
                    </Heading>
                    <Text fontSize={"lg"} color={"gray.600"}>
                        to begin taking care of your plants 🌱
                    </Text>
                </Stack>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    p={8}
                >
                    <Stack spacing={4}>
                        <HStack>
                            <Box>
                                <FormControl id="firstName" isRequired>
                                    <FormLabel>First Name</FormLabel>
                                    <Input
                                        type="text"
                                        value={firstName}
                                        onChange={(evt) =>
                                            setFirstName(evt.target.value)
                                        }
                                        placeholder="First Name"
                                    />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl id="lastName">
                                    <FormLabel>Last Name</FormLabel>
                                    <Input
                                        type="text"
                                        value={lastName}
                                        onChange={(evt) =>
                                            setLastName(evt.target.value)
                                        }
                                        placeholder="Last Name"
                                    />
                                </FormControl>
                            </Box>
                        </HStack>
                        <FormControl id="username" isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type="text"
                                value={username}
                                onChange={(evt) => setUsername(evt.target.value)}
                                placeholder="Username"
                            />
                        </FormControl>
                        <FormControl id="email" isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(evt) => setEmail(evt.target.value)}
                                placeholder="Email"
                            />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(evt) =>
                                        setPassword(evt.target.value)
                                    }
                                    placeholder="Password"
                                />
                                <InputRightElement h={"full"}>
                                    <Button
                                        variant={"ghost"}
                                        onClick={() =>
                                            setShowPassword(
                                                (showPassword) => !showPassword
                                            )
                                        }
                                    >
                                        {showPassword ? (
                                            <ViewIcon />
                                        ) : (
                                            <ViewOffIcon />
                                        )}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Submitting"
                                size="lg"
                                bg={"green.400"}
                                color={"white"}
                                _hover={{
                                    bg: "green.500",
                                }}
                                onClick={() => signUp()}
                            >
                                Sign up
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={"center"}>
                                Already a user?{" "}
                                <Link color={"green.400"} href="/login">
                                    Login
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
