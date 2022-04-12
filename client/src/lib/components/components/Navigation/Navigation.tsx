/**
 * Navigation.tsx
 *
 * Primary site navigation. No comments as this
 * is primarily html with self explanatory callbacks.
 * @author Yousef
 */

import React from "react";
import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Link,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
    useColorMode,
    Heading,
    Badge,
} from "@chakra-ui/react";
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from "@chakra-ui/icons";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useStore } from "lib/store/store";
import logo from "../../../../assets/logo.png";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Navigation() {
    const {
        selectedPlantID,
        setSelectedPlantID,
        isAuth,
        setIsAuth,
        setUser,
        plants,
    } = useStore((state) => ({
        selectedPlantID: state.selectedPlantID,
        setSelectedPlantID: state.setSelectedPlantID,
        isAuth: state.isAuth,
        setIsAuth: state.setIsAuth,
        setUser: state.setUser,
        plants: state.plants,
    }));
    const router = useRouter();
    const isSelected = (id: any) => id === selectedPlantID;

    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onClose, onToggle } = useDisclosure();
    const [hidden, setHidden] = useState(!isOpen);

    const signOut = () => {
        setIsAuth(false);
        setUser(null);
        router.push("/login");
    };

    /**
     * Close the mobile nav on desktop window size.
     */
    const mobileNavBreakPoint = useBreakpointValue({ base: "_", lg: "hidden" });
    useEffect(() => {
        if (mobileNavBreakPoint === "hidden") onClose();
    }, [mobileNavBreakPoint]);

    /**
     * Close the mobile nav if clicked outside.
     */
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const outsideClickListener = (event: any) => {
            const target = event.target;
            if (!target.closest("#menu-container")) {
                onClose();
            }
        };

        document.addEventListener("click", outsideClickListener);
        return () =>
            document.removeEventListener("click", outsideClickListener);
    }, [isOpen]);

    return (
        <Box>
            <Flex
                zIndex={10}
                as="header"
                position="fixed"
                w="100%"
                bg={useColorModeValue("white", "gray.800")}
                color={useColorModeValue("gray.600", "white")}
                minH={"70px"}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={"solid"}
                borderColor={useColorModeValue("gray.200", "gray.900")}
                align={"center"}
            >
                <Flex
                    flex={{ base: 1, lg: "auto" }}
                    ml={{ base: -2 }}
                    display={{ base: "flex", lg: "none" }}
                    align="center"
                >
                    <IconButton
                        onClick={onToggle}
                        icon={
                            isOpen ? (
                                <CloseIcon w={3} h={3} />
                            ) : (
                                <HamburgerIcon w={5} h={5} />
                            )
                        }
                        variant={"ghost"}
                        aria-label={"Toggle Navigation"}
                    />
                </Flex>
                <Flex
                    flex={{ base: 1 }}
                    justify={{ base: "center", lg: "start" }}
                    align="center"
                >
                    <Text
                        textAlign={useBreakpointValue({
                            base: "center",
                            lg: "left",
                        })}
                        fontFamily={"heading"}
                        color={useColorModeValue("gray.800", "white")}
                    >
                        <Heading as="h1" size="md">
                            <Flex alignItems={"center"}>
                                <Image
                                    src={logo}
                                    width={55}
                                    height={40}
                                    onClick={() => {
                                        //console.log("clear ls")
                                        localStorage.clear();
                                    }}
                                />
                                <Link ml={3} href="/">
                                    floralyfe
                                </Link>
                            </Flex>
                        </Heading>
                        {/* Breaks styles with svg, try dynamic */}
                    </Text>

                    <Flex
                        display={{ base: "none", lg: isAuth ? "flex" : "none" }}
                        ml={10}
                        width="100%"
                        justify="center"
                        align="center"
                    >
                        <DesktopNav />
                    </Flex>
                </Flex>

                <Stack
                    flex={{ base: 1, lg: 0 }}
                    justify={"flex-end"}
                    direction={"row"}
                    spacing={6}
                >
                    <Flex alignItems={"center"}>
                        <Box>
                            <Flex alignItems={"center"}>
                                {isAuth &&
                                    Object.keys(plants).map((plantId, idx) => (
                                        <Badge
                                            key={idx}
                                            mr={4}
                                            borderRadius="full"
                                            px="2"
                                            colorScheme={
                                                isSelected(plantId)
                                                    ? "green"
                                                    : "gray"
                                            }
                                            onClick={() =>
                                                setSelectedPlantID(plantId)
                                            }
                                            cursor={"pointer"}
                                        >
                                            {plants[plantId].name}
                                        </Badge>
                                    ))}
                            </Flex>
                        </Box>
                        {isAuth && (
                            <Button mr={4} onClick={() => signOut()}>
                                Sign out
                            </Button>
                        )}
                        <Button onClick={toggleColorMode}>
                            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                        </Button>
                    </Flex>
                </Stack>
            </Flex>

            <motion.div
                id="menu-container"
                hidden={hidden && !isAuth}
                initial={false}
                onAnimationStart={() => setHidden(false)}
                onAnimationComplete={() => setHidden(!isOpen)}
                animate={{ width: isOpen ? 500 : 0 }}
                style={{
                    background: useColorModeValue(
                        "white",
                        "var(--chakra-colors-gray-700)"
                    ),
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    position: "absolute",
                    left: "0",
                    height: "100vh",
                    top: "0",
                    zIndex: 2,
                }}
            >
                <MobileNav />
            </motion.div>
        </Box>
    );
}

const DesktopNav = () => {
    const linkColor = useColorModeValue("gray.600", "gray.200");
    const linkHoverColor = useColorModeValue("gray.800", "white");
    const popoverContentBgColor = useColorModeValue("white", "gray.800");

    return (
        <Stack direction={"row"} spacing={4}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={"hover"} placement={"bottom-start"}>
                        <PopoverTrigger>
                            <Link
                                p={2}
                                href={navItem.href ?? "#"}
                                fontSize={"lg"}
                                fontWeight={700}
                                color={linkColor}
                                _hover={{
                                    textDecoration: "none",
                                    color: linkHoverColor,
                                }}
                            >
                                {navItem.label}
                                {navItem.children && <ChevronDownIcon />}
                            </Link>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow={"xl"}
                                bg={popoverContentBgColor}
                                p={4}
                                rounded={"xl"}
                                minW={"sm"}
                            >
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav
                                            key={child.label}
                                            {...child}
                                        />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
    return (
        <Link
            href={href}
            role={"group"}
            display={"block"}
            p={2}
            rounded={"lg"}
            _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
        >
            <Stack direction={"row"} align={"center"}>
                <Box>
                    <Text
                        transition={"all .3s ease"}
                        _groupHover={{ color: "pink.400" }}
                        fontWeight={500}
                    >
                        {label}
                    </Text>
                    {subLabel && <Text fontSize={"sm"}>{subLabel}</Text>}
                </Box>
                <Flex
                    transition={"all .3s ease"}
                    transform={"translateX(-10px)"}
                    opacity={0}
                    _groupHover={{
                        opacity: "100%",
                        transform: "translateX(0)",
                    }}
                    justify={"flex-end"}
                    align={"center"}
                    flex={1}
                >
                    <Icon
                        color={"pink.400"}
                        w={5}
                        h={5}
                        as={ChevronRightIcon}
                    />
                </Flex>
            </Stack>
        </Link>
    );
};

const MobileNav = () => {
    return (
        <Stack
            bg={useColorModeValue("white", "gray.700")}
            p={4}
            display={{ lg: "none" }}
            paddingTop="80px"
        >
            {NAV_ITEMS.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Flex
                py={2}
                as={Link}
                href={href ?? "#"}
                justify={"space-between"}
                align={"center"}
                _hover={{
                    textDecoration: "none",
                }}
            >
                <Text
                    fontWeight={600}
                    color={useColorModeValue("gray.600", "gray.200")}
                >
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={"all .25s ease-in-out"}
                        transform={isOpen ? "rotate(180deg)" : ""}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>

            <Collapse
                in={isOpen}
                animateOpacity
                style={{ marginTop: "0!important" }}
            >
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={"solid"}
                    borderColor={useColorModeValue("gray.200", "gray.700")}
                    align={"start"}
                >
                    {children &&
                        children.map((child) => (
                            <Link key={child.label} py={2} href={child.href}>
                                {child.label}
                            </Link>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};

interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
    {
        label: "Register Plants",
        href: "/registerplants",
    },
    {
        label: "Dashboard",
        href: "/",
    },
    // {
    // 	label: "Account",
    // 	children: [
    // 		// {
    // 		// 	label: "Profile",
    // 		// 	subLabel: "Edit your profile",
    // 		// 	href: "#",
    // 		// },
    // 		{
    // 			label: "Sign out",
    // 			href: "/login",
    // 		},
    // 	],
    // },
];
