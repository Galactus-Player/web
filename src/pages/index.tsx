import { Button, Flex, Heading, HStack, Text } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { DefaultApi, RoomApi } from "../api/room/index";
import React from "react";
import { Form, Formik } from "formik";
import { InputField } from "../components/general/InputField";

interface indexProps {}

export const Index: React.FC<indexProps> = ({}) => {
  const router = useRouter();
  const roomApi = new RoomApi();
  const defaultRoomApi = new DefaultApi();
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
        <Text mt={2}>
          Watch videos from Youtube, Vimeo, Facebook (and many more) with
          friends anywhere
        </Text>
        <Formik
          initialValues={{ code: "", field: "" }}
          onSubmit={async (values, { setErrors }) => {
            if (values.field === "new") {
              const newRoom = await roomApi.addRoom();
              router.push("/room?code=" + newRoom.code);
            } else if (values.field === "join") {
              try {
                const room = await defaultRoomApi.getRoomByCode({
                  code: values.code,
                });
                router.push("/room?code=" + room.code);
              } catch {
                setErrors({ code: "Invalid Code" });
              }
            }
          }}
        >
          {({ isSubmitting, submitForm, setFieldValue }) => (
            <Form>
              <HStack mt={10} alignItems="top">
                <Button
                  colorScheme="teal"
                  w="150px"
                  isLoading={isSubmitting}
                  onClick={() => {
                    setFieldValue("field", "new");
                    submitForm();
                  }}
                >
                  New Room
                </Button>
                <InputField
                  name="code"
                  placeholder="Enter a code or link"
                  label="code"
                ></InputField>
                <Button
                  colorScheme="teal"
                  variant="ghost"
                  isLoading={isSubmitting}
                  onClick={() => {
                    setFieldValue("field", "join");
                    submitForm();
                  }}
                >
                  Join
                </Button>
              </HStack>
            </Form>
          )}
        </Formik>
      </Flex>
    </>
  );
};

export default Index;
