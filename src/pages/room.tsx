import { Flex, Heading } from "@chakra-ui/core";
import React from "react";
import { DarkModeSwitch } from "../components/DarkModeSwitch";

interface roomProps {}

export const Room: React.FC<roomProps> = ({}) => {
  return (
    <>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        mt={10}
      >
        <Flex justify="center" mb={5}>
          <Heading fontSize="5vh">Room ABCDE</Heading>
        </Flex>
        <iframe
          width="1700"
          height="800"
          src="https://www.youtube.com/embed/y8OnoxKotPQ"
        ></iframe>
      </Flex>
      <DarkModeSwitch />
    </>
  );
};

export default Room;
