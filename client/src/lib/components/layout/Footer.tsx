import { Flex, Link, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex as="footer" width="full" align="center">
      <Text>
        {new Date().getFullYear()} -{" "}
        <Link href="https://github.com/Yyassin" isExternal rel="noopener noreferrer">
          flora.lyfe
        </Link>
      </Text>
    </Flex>
  );
};

export default Footer;
