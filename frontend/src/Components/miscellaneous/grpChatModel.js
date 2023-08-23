import React, { useState } from "react";
import {
  Input,
  useToast,
  useDisclosure,
  Image,
  Text,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../../context/chatProvider";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import UserListItem from "../userAvatar/UserListItem";
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

import UserBadgeItem from "../userAvatar/UserBadge";
import { ViewIcon } from "@chakra-ui/icons";
import ChatLoading from "../ChatLoading";
const GroupChatModal = ({ children }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { user, chats, setChats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();

  const submitfunc = async () => {
    if (!groupChatName || selectedUsers.length < 2) {
      toast({
        title: "information not filled correctly",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "failed",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  };
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };
  const handleGroup = (usertoadd) => {
    if (selectedUsers.includes(usertoadd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, usertoadd]);
  };

  const handleSearch = async (query) => {
    if (!query) {
      toast({
        title: `error `,
        status: "warning",
        position: "top-left",
        isClosable: true,
        duration: "5000",
      });
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user/?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured ",
        description: error.response.data.message,
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily="Work sans"
            display="flex"
            fontSize="32px"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder="Chat Name"
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user1={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              // type="submit"
              mr={3}
              onClick={submitfunc}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
