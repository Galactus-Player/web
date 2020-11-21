import {
  Box,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
  Button,
  Flex,
} from "@chakra-ui/core";
import { EditIcon } from "@chakra-ui/icons/dist/types/Edit";
import { Form } from "formik";
import React from "react";
import { BsPlusSquare } from "react-icons/bs";
import { Button as MyButton } from "./Button";

interface AddProps {}

export const Add: React.FC<AddProps> = ({}) => {
  return (
    <>
      <Popover trigger="hover" size="lg">
        <PopoverTrigger>
          <Box>
            <MyButton ButtonType={BsPlusSquare} />
          </Box>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            <Flex>
              <Input></Input>
              <Button>Play Now</Button>
              <Button>Play Now</Button>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
