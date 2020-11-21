import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
  ThemeProvider,
  useDisclosure,
} from "@chakra-ui/core";
import { BsPlusCircle } from "react-icons/bs";
import { BiPlayCircle } from "react-icons/bi";
import { Video } from "../../api/queue";
import { DarkModeSwitch } from "../DarkModeSwitch";
import React from "react";
import { Thumbnail } from "./Thumbnail";
import { Form, Formik } from "formik";
import { InputField } from "../general/InputField";
import { Button as CustomButton } from "./buttons/Button";

interface VideoQueueProps {
  videoQueue: Video[];
  removeVideo: (videoId: string) => Promise<void>;
  playVideo: (videoId: string) => Promise<void>;
  formOnSubmit: (values: { url: string; isQueue: boolean }) => Promise<void>;
}

// TODO: call Youtube API/Vimeo API/etc... to get video metadata (Title,.. etc)
export const VideoQueue: React.FC<VideoQueueProps> = ({
  videoQueue,
  removeVideo,
  playVideo,
  formOnSubmit,
}) => {
  const [gray, setGray] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <BsPlusCircle
        size="60px"
        cursor={gray ? "pointer" : undefined}
        color={gray ? "gray" : "white"}
        onMouseEnter={() => setGray(true)}
        onMouseLeave={() => setGray(false)}
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <Flex>
                <Heading size="2xl">Galactus Player 🚀</Heading>
                <DarkModeSwitch />
              </Flex>
            </DrawerHeader>
            <DrawerBody>
              <Stack>
                <Heading size="md">Play or Queue Video</Heading>
                <Formik
                  initialValues={{ url: "", isQueue: false }}
                  onSubmit={async (values) => formOnSubmit(values)}
                >
                  {({ isSubmitting, submitForm, setFieldValue }) => (
                    <Form>
                      <HStack alignContent="left" mb={5}>
                        <InputField
                          name="url"
                          placeholder="Video URL"
                          label=""
                        ></InputField>
                        <Button
                          shadow="sm"
                          onClick={submitForm}
                          isLoading={isSubmitting}
                        >
                          Play
                        </Button>
                        <Button
                          shadow="sm"
                          onClick={() => {
                            setFieldValue("isQueue", true);
                            submitForm();
                          }}
                          isLoading={isSubmitting}
                        >
                          Queue
                        </Button>
                      </HStack>
                    </Form>
                  )}
                </Formik>
                <Heading size="md">Up Next ...</Heading>
                {videoQueue.map((video, key) => (
                  <Thumbnail
                    key={key}
                    thumbnailUrl={video.thumbnailUrl}
                    playNowOnClick={async () => await playVideo(video.id!)}
                    removeVideoOnClick={async () =>
                      await removeVideo(video.id!)
                    }
                  />
                ))}
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};
