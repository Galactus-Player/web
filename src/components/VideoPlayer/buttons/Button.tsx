import React from "react";
import { IconType } from "react-icons/lib";

interface ButtonProps {
  ButtonType: IconType;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ ButtonType, onClick }) => {
  const [gray, setGray] = React.useState(false);
  return (
    <ButtonType
      size="60px"
      cursor={gray ? "pointer" : undefined}
      color={gray ? "gray" : "white"}
      onMouseEnter={() => setGray(true)}
      onMouseLeave={() => setGray(false)}
      onClick={onClick}
    />
  );
};
