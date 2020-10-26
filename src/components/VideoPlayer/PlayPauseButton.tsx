import { Button } from "@chakra-ui/core";
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
        <Button onClick={onClick}>Pause</Button>
      ) : (
        <Button onClick={onClick}>Play</Button>
      )}
    </>
  );
};
