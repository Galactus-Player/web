import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/core";
import React, { useEffect } from "react";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { NavBar } from "../components/general/Navbar";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import { useRouter } from "next/router";
import { joinRoom } from "../api/sync/sync-client";

interface roomProps {}

export const Room: React.FC<roomProps> = ({}) => {
  const {
    query: { code },
  } = useRouter();

  useEffect(() => {
    const codeNum = parseInt(code as string, 10);
    joinRoom(codeNum);
  });

  return (
    <>
      <NavBar />
      <Flex direction="column" alignItems="center" mt={10}>
        <Box width="70%" height="100%">
          <Stack>
            <Heading textAlign="center">
              You are in room {code?.toString()}!
            </Heading>
            <VideoPlayer />
          </Stack>
        </Box>
      </Flex>
    </>
  );
};

export default Room;
