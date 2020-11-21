import React from "react";
import { BsFillPauseFill, BsPause, BsPlay } from "react-icons/bs";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import { IconType } from "react-icons/lib";

interface PlayProps {
  playing: boolean;
  onClick?: () => void;
}

export const Play: React.FC<PlayProps> = ({ playing, onClick }) => {
  const [gray, setGray] = React.useState(false);
  const Button = playing ? IoIosPause : IoIosPlay;
  return (
    <Button
      size="60px"
      cursor={gray ? "pointer" : undefined}
      color={gray ? "gray" : "white"}
      onMouseEnter={() => setGray(true)}
      onMouseLeave={() => setGray(false)}
      onClick={onClick}
    />
  );
};
