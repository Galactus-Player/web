import { Button, IconButton, useToast } from "@chakra-ui/core";
import React from "react";
import { FiCopy } from "react-icons/fi";

interface CopyProps {
  room: string | undefined;
}

export const Copy: React.FC<CopyProps> = ({ room }) => {
  const link = `https://galactus.live/room?code=${room}`;
  const onClickRoomCopy = async () => {
    await navigator.clipboard.writeText(link);
  };

  const toast = useToast();
  return (
    <IconButton
      size="md"
      icon={<FiCopy />}
      variant="outline"
      rounded="full"
      colorMode="dark"
      onClick={async () => {
        await onClickRoomCopy();
        toast({
          title: "Copy Successfull.",
          description: link + " has been saved to your clipboard!",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }}
    />
  );
};
