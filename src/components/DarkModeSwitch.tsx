import { useColorMode, Switch, Text, Flex } from "@chakra-ui/core";
import React from "react";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <>
      <Flex alignItems="center" padding="10px" rounded="md">
        <Switch
          defaultIsChecked={true}
          color="green"
          isChecked={isDark}
          onChange={toggleColorMode}
          mr={2}
        />
      </Flex>
    </>
  );
};
