import { Button, IconButton } from "@chakra-ui/core";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";

import React from "react";

interface PlayPauseButtonProps {
  playing: boolean;
  onClick: () => void;
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  playing,
  onClick,
}) => {
  return (
    <>
      {playing ? (
        <IconButton
          colorScheme="teal"
          isRound={true}
          aria-label="Call Sage"
          onClick={onClick}
          fontSize="20px"
          icon={<AiFillPauseCircle />}
        />
      ) : (
        <IconButton
          isRound={true}
          colorScheme="teal"
          aria-label="Call Sage"
          onClick={onClick}
          fontSize="20px"
          icon={<AiFillPlayCircle />}
        />
      )}
    </>
  );
};
