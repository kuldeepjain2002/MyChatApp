import {
  Box,
  Button,
  Tooltip,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Input } from "@chakra-ui/input";
import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { Text, Image } from "@chakra-ui/react";
import { ChatState } from "../../context/chatProvider";
import { useHistory } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { BellIcon, SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, chats, setSelectedChat, setChats } = ChatState();
  // console.log(user);
  const history = useHistory();
  const LogoutFunc = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const toast = useToast();

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      // console.log(67);
      const { data } = await axios.post("/api/chat", { userId }, config);
      // console.log(data);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoading(false);
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: `error??`,
        status: "warning",
        position: "top-left",
        isClosable: true,
        duration: "5000",
      });
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: `error - nothing to search`,
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
      const { data } = await axios.get(`/api/user/?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#F4EEE0"
        w="100%"
        p="3px 10px 3px 10px"
        borderWidth="3px"
      >
        <Tooltip label="Search for finding friends">
          <button variant="ghost" onClick={onOpen}>
            <SearchIcon />
            <Text display={{ base: "none", md: "inline" }} padding={2}>
              Search
            </Text>
          </button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Let's Chat
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              bgColor="#4F4557"
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="xs"
                name={user.name}
                src={user.pic}
                cursor="pointer"
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={LogoutFunc}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        // finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Friends</DrawerHeader>

          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={4}
                value={search}
                width="70%"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user1) => (
                <UserListItem
                  user1={user1}
                  key={user1._id}
                  handleFunction={() => accessChat(user1._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
