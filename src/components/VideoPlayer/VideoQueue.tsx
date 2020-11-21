import { Stack, Box, Image, Button, HStack, Link, Text, Flex } from "@chakra-ui/core";
import React from "react";
import { Video } from '../../api/queue';

interface VideoQueueProps {
  videoQueue: Video[];
  removeVideo: (videoId: string) => Promise<void>;
  playVideo: (videoId: string) => Promise<void>;
}

export const VideoQueue: React.FC<VideoQueueProps> = ({ videoQueue, removeVideo, playVideo }) => {
  return (
    <Flex flexDirection="column" w="22em" h="750px" alignItems="center" borderWidth="1px" borderRadius="lg" boxShadow="lg" overflow="auto">
      <Text textAlign="center" mb="10px" mt="5px" fontSize="2xl">Queue</Text>
      <Stack alignItems="center" overflow="auto">
        {videoQueue.map((video, key) => (
          <Box className="videoInQ" bg="gray.50" pb="10px" w="20em" borderRadius="base" key={key}>
            <Image
              src={video.thumbnailUrl}
              alt={"/videoIcon.png"}
              w="20em"
            />
            <Text m="10px" color="black.500" noOfLines={2}><b>{video.title}</b></Text>
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
    </Flex>
  );
};
