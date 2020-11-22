import {
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
  Stack,
  useDisclosure,
} from "@chakra-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { Video } from "../../api/queue";
import { DarkModeSwitch } from "../DarkModeSwitch";
import { InputField } from "../general/InputField";
import { Thumbnail } from "./Thumbnail";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        size="lg"
        rounded="full"
        variant="outline"
        onClick={onOpen}
        colorMode="dark"
      >
        <Heading>Play or Queue</Heading>
      </Button>
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
                    title={video.title}
                    url={video.url}
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
