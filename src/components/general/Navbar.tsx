import {
  Box,
  Flex,
  Heading,
  Link,
  useColorMode,
  Switch,
  Text,
  HStack,
} from "@chakra-ui/core";
import NextLink from "next/link";
import React from "react";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <Box
      as="nav"
      bg="primary"
      paddingTop="1.5em"
      paddingBottom="1.5em"
      shadow="lg"
    >
      <Box margin="auto" width="70%">
        <Flex justifyContent="space-between" alignItems="center">
          <NextLink href="/">
            <Link>
              <Heading>Galactus</Heading>
            </Link>
          </NextLink>
          <Switch color="green" isChecked={isDark} onChange={toggleColorMode} />
        </Flex>
      </Box>
    </Box>
  );
};
