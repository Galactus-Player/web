import { Box, Flex, Heading, Stack } from "@chakra-ui/core";
import React from "react";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { NavBar } from "../components/general/Navbar";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";

interface roomProps {}

export const Room: React.FC<roomProps> = ({}) => {
  return (
    <>
      <NavBar />
      <Flex
        direction="column"
        alignItems="center"
        // justifyContent="flex-start"
        mt={10}
      >
        <Box width="70%" height="100%">
          <Stack>
            <VideoPlayer />
          </Stack>
        </Box>
      </Flex>
      {/* <DarkModeSwitch /> */}
    </>
  );
};

export default Room;
