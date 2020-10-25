import { useColorMode, Switch, Text } from "@chakra-ui/core";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <>
      <Text>Dark Mode</Text>
      <Switch
        position="fixed"
        top="2rem"
        right="1rem"
        color="green"
        isChecked={isDark}
        onChange={toggleColorMode}
      />
    </>
  );
};
