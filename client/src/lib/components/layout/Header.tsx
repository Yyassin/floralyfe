import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import Navigation from "../components/Navigation/Navigation";

const Header = () => {
  return (
    <Flex as="header" width="full" align="left">
      <Navigation />
    </Flex>
  );
};

export default Header;
