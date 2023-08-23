import React, { useState } from "react";
import { useDisclosure, Image, Text, Center } from "@chakra-ui/react";
import {
  Box,
  Button,
  Tooltip,
  Avatar,
  localStorageManager,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily="Work sans"
            display="flex"
            fontSize="32px"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
              />
            </Center>

            <Center>
              <Text
                fontSize={{ base: "20px", md: "23px" }}
                fontFamily="Work sans"
                padding="5px"
              >
                Email : {user.email}
              </Text>
            </Center>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
