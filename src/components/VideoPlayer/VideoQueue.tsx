import { Stack, Text } from "@chakra-ui/core";
import React from "react";

interface VideoQueueProps {
  videoQueue: string[];
}

// TODO: call Youtube API/Vimeo API/etc... to get video metadata (Title,.. etc)
export const VideoQueue: React.FC<VideoQueueProps> = ({ videoQueue }) => {
  return (
    <Stack>
      {videoQueue.map((url) => (
        <Text>{url}</Text>
      ))}
    </Stack>
  );
};
