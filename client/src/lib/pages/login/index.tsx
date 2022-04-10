import React from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Link,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useStore } from "lib/store/store";
import { deepLog } from "lib/components/hooks/validate";
import { createQuery } from "lib/api/createQuery";
import { GET_USER } from "lib/api/queries";
import { toastSuccess, toastError, dismissAll } from "../../components/util/toast";

// source: https://chakra-templates.dev/forms/authentication

const Login = () => {
    const { setUser, setIsAuth } = useStore((state) => ({
        setIsAuth: state.setIsAuth,
        setUser: state.setUser,
    }));
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    

    const signIn = async () => {
        dismissAll();
        deepLog(`Attempted login: email=${email}, password=${password}`);
        
        const response =  await createQuery(GET_USER,
            {
                email,
                password
            });

        if (!response) {
            deepLog("Incorrect email or password.");
            toastError("Incorrect email or password.");
            return;
        }

        const data = response.data;
        const { users: user } = data;

        //console.log(user)

        if (!user) {
            deepLog("Incorrect email or password.");
            toastError("Incorrect email or password.");
            return;
        }

        deepLog(`Successful authentication`);
        toastSuccess("Successfully logged in!.");
        setIsAuth(true);
        setUser(user);
        router.push("/");
    };

    return (
        <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
        >
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"}>Sign in to your account</Heading>
                    <Text fontSize={"lg"} color={"gray.600"}>
                        to check up on your plants 🌿
                    </Text>
                </Stack>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    p={8}
                >
                    <Stack spacing={4}>
                        <FormControl id="email">
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
                        <Stack spacing={10}>
                            <Button
                                bg={"green.400"}
                                color={"white"}
                                _hover={{
                                    bg: "green.500",
                                }}
                                onClick={() => signIn()}
                            >
                                Sign in
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={"center"}>
                                Don't have an account?{" "}
                                <Link color={"green.400"} href="/signup">
                                    Sign Up
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};

export default Login;
