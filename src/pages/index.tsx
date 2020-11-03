import { Button, Flex, Heading, HStack, Input } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { RoomApi } from "../api/room/index"
import React from "react";
import { DarkModeSwitch } from "../components/DarkModeSwitch";

interface indexProps {}

export const Index: React.FC<indexProps> = ({}) => {
  const router = useRouter();
  const roomApi = new RoomApi();
  return (
    <>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        mt="20vh"
      >
        <Flex justify="center">
          <Heading fontSize="10vh">Galactus 🚀</Heading>
        </Flex>
        <Heading fontSize="2vh" mt={5}>
          A synchronized video experience.
        </Heading>
        <HStack mt={10}>
          <Button
            colorScheme="teal"
            w="150px"
            onClick={() => {
              const newRoomPromise = roomApi.addRoom();
              newRoomPromise.then(room => {
                router.push("/room?code=" + room.code);
              }).catch(error => {
                alert(error.message)
              });
            }}
          >
            New Room
          </Button>
          <Input placeholder="Enter a code or link" variant="filled" />
          <Button colorScheme="teal" variant="ghost" disabled={true}>
            Join
          </Button>
        </HStack>
      </Flex>
      <DarkModeSwitch />
    </>
  );
};

export default Index;
