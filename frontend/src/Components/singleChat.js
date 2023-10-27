import React, { useEffect } from "react";
import { useState } from "react";
import { FormControl } from "@chakra-ui/form-control";
import { ChatState } from "../context/chatProvider";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/chatLogic";
import ProfileModal from "./miscellaneous/ProfileModal";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatLogic";

import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
// import IndividualChat from "./IndividualChat";
// import Lottie from "react-lottie";
import axios from "axios";
import "./styles.css";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();
  const { user, selectedChat, chats, setSelectedChat, setChats } = ChatState();
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
      // console.log("connection made true");
    });

    // console.log("connection made");

    socket.on("senderistyping", () => {
      setIsTyping(true);
    });
    socket.on("senderstoptyping", () => {
      setIsTyping(false);
    });
  }, []);

  const getMessages = async () => {
    try {
      if (!selectedChat) return;

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const messageList = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      // console.log("messagesssssssssss", messages);
      setMessages(messageList.data);
      // console.log("messagesssssssssss", messages);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);

      return;
    } catch (error) {
      toast({
        title: `Error occured`,
        description: "Unable to fetch the messages",
        status: "error",
        isClosable: true,
        duration: "3000",
      });
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        socket.emit("stoptyping", selectedChat._id);
        setTyping(false);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setLoading(true);
        const { data } = await axios.post(
          "api/message",
          {
            messageToSend: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setNewMessage("");
        setMessages([...messages], data);
        setLoading(false);
        // console.log("loading turned off -- ", loading, messages, newMessage);

        socket.emit("new message", data);
        getMessages();
      } catch (error) {
        toast({
          title: `error occured`,
          description: "failed to send message",
          status: "error",
          isClosable: true,
          duration: "3000",
        });
      }
    }
  };

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        selectedChatCompare &&
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //give notification
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    getMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    // console.log(e.target.value);
    if (e.target.value === "") {
      console.log("empty message");
      socket.emit("stoptyping", selectedChat._id);
      setTyping(false);
    } else {
      socket.emit("istyping", selectedChat._id);
      setTyping(true);
    }
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(selectedChat.users, user)}
                  <ProfileModal
                    user={getSenderFull(selectedChat.users, user)}
                  />
                </>
              ) : (
                <>{selectedChat.chatName}</>
              ))}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#F4EEE0"
            w="100%"
            h="87%"
            borderRadius="lg"
            overflowY="hidden"
            //messages here
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              // <div className="messages">
              <ScrollableFeed>
                {messages &&
                  messages.map((m, i) => {
                    return (
                      <div style={{ display: "flex" }} key={m._id}>
                        {isSameSender(messages, m, i, user._id) ||
                        isLastMessage(messages, i, user._id) ? (
                          <>
                            <Tooltip
                              label={m.sender.name}
                              placement="bottom-start"
                              hasArrow
                            >
                              <Avatar
                                mt="7px"
                                mr={1}
                                size="sm"
                                cursor="pointer"
                                name={m.sender.name}
                                src={m.sender.pic}
                              />
                            </Tooltip>
                            <span
                              style={{
                                backgroundColor: `${
                                  m.sender._id === user._id
                                    ? "#BEE3F8"
                                    : "#B9F5D0"
                                }`,
                                color: "black",
                                marginLeft: isSameSenderMargin(
                                  messages,
                                  m,
                                  i,
                                  user._id
                                ),
                                marginTop: isSameUser(messages, m, i, user._id)
                                  ? 3
                                  : 10,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                              }}
                            >
                              {/* {console.log(m.content)} */}
                              {m.content}
                            </span>
                          </>
                        ) : (
                          <span
                            style={{
                              backgroundColor: `${
                                m.sender._id === user._id
                                  ? "#BEE3F8"
                                  : "#B9F5D0"
                              }`,
                              color: "black",
                              marginLeft: isSameSenderMargin(
                                messages,
                                m,
                                i,
                                user._id
                              ),
                              marginTop: isSameUser(messages, m, i, user._id)
                                ? 3
                                : 10,
                              borderRadius: "20px",
                              padding: "5px 15px",
                              maxWidth: "75%",
                            }}
                          >
                            {/* {console.log(m.content)} */}
                            {m.content}
                          </span>
                        )}
                      </div>
                    );
                  })}
                {istyping ? <p>typing</p> : <p></p>}
              </ScrollableFeed>
              // </div>
            )}
            <FormControl onKeyDown={sendMessage} id="first-name" isRequired>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="2xl" pb={3} fontFamily="Work sans" padding="20%">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
