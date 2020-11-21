import { Stack, Text, Box, Image, Button, HStack, Link } from "@chakra-ui/core";
import React from "react";
import { Video } from '../../api/queue';

interface VideoQueueProps {
  videoQueue: Video[];
  removeVideo: (videoId: string) => Promise<void>;
  playVideo: (videoId: string) => Promise<void>;
}

// TODO: call Youtube API/Vimeo API/etc... to get video metadata (Title,.. etc)
export const VideoQueue: React.FC<VideoQueueProps> = ({ videoQueue, removeVideo, playVideo }) => {
  return (
    <Box w="20em" mb="2em">
      <Stack>
        {videoQueue.map((video, key) => (
          <Box className="videoInQ" key={key}>
            <Image
              src={video.thumbnailUrl}
              alt={"/videoIcon.png"}
              w="20em"
            />
            <HStack justifyContent="space-evenly" mt="10px">
              <Button onClick={async () => await playVideo(video.id!)} id="playFromQ">
                Play Now
              </Button>
              <Button onClick={async () => await removeVideo(video.id!)} id="playFromQ">
                Remove
              </Button>
              <Link href={video.url} isExternal color={"teal.500"}>
                <b>Source</b>
              </Link> 
            </HStack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
