import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import { getSender } from "../config/chatLogic";
// import Box from "@chakra-ui/layout";
import ChatLoading from "./ChatLoading";
import { Button, StackDivider, VStack } from "@chakra-ui/react";
import { get } from "mongoose";
import GroupChatModal from "./miscellaneous/grpChatModel";

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, chats, setSelectedChat, setChats } = ChatState();
  const [loggedUser, setloggedUser] = useState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      // console.log("chatss");
      // console.log(data);
    } catch (error) {
      toast({
        title: `error??`,
        status: "warning",
        position: "top-left",
        isClosable: true,
        duration: "5000",
      });
    }
  };
  useEffect(() => {
    setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
    // console.log(35);

    fetchChats();
    // console.log(chats);
  }, [fetchAgain]);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="#F4EEE0"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          // paddingRight={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
          <GroupChatModal>
            <Button
              display="flex"
              fontSize={{ base: "15px", md: "8px", lg: "15px" }}
              rightIcon={<AddIcon />}
              bgColor="#A9907E"
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          display="flex"
          flexDir="column"
          overflowY="hidden"
          padding="2px"
          width="100%"
          height="100%"
        >
          {chats ? (
            <VStack
              // divider={<StackDivider borderColor="gray.200" />}
              spacing={3}
              align="stretch"
              overflowY="scroll"
            >
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#678983" : "#4F4557"}
                  color={selectedChat === chat ? "#F4EEE0" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  {chat.isGroupChat
                    ? chat.chatName
                    : getSender(chat.users, user)}
                </Box>
              ))}
            </VStack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
