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
      <Box h="100vh" w="100vw">
        <VideoPlayer room={code as string} />
      </Box>
    </>
  );
};

export default Room;
