import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import React from "react";
import { Button as CustomButton } from "./buttons/Button";
import { BiAddToQueue, BiPlayCircle, BiTrash } from "react-icons/bi";

interface ThumbnailProps {
  title: string | undefined;
  url: string | undefined;
  thumbnailUrl: string | undefined;
  playNowOnClick: () => Promise<void>;
  removeVideoOnClick: () => Promise<void>;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnailUrl,
  playNowOnClick,
  removeVideoOnClick,
  title,
  url,
}) => {
  const [showButtons, setShowButtons] = React.useState(false);
  return (
    <Stack>
      <Stack
        onMouseEnter={() => {
          setShowButtons(true);
        }}
        onMouseLeave={() => {
          setShowButtons(false);
        }}
      >
        <Flex
          rounded="lg"
          borderWidth="2px"
          height="250px"
          alignItems="center"
          justifyContent="center"
          shadow="lg"
          backgroundSize="cover"
          backgroundImage={'url("' + thumbnailUrl + '")'}
        >
          {showButtons ? (
            <>
              <Flex bg="gray.800" padding="5px" rounded="lg">
                <CustomButton
                  ButtonType={BiPlayCircle}
                  onClick={playNowOnClick}
                />
                <Box mr={2} />
                <CustomButton
                  ButtonType={BiTrash}
                  onClick={removeVideoOnClick}
                />
              </Flex>
            </>
          ) : null}
        </Flex>
        <Flex>
          <Link href={url}>
            <Heading size="md">{title}</Heading>
          </Link>
        </Flex>
      </Stack>
    </Stack>
  );
};
