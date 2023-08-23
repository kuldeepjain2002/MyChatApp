import React from "react";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { ChatState } from "../context/chatProvider";
import SideDrawer from "../Components/miscellaneous/sidedrawer";
import ChatBox from "../Components/chatBox";
import MyChats from "../Components/myChats";
// import { useState } from "react";

const ChatPage = () => {
  // console.log("hiiii chatpage");
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%", maxHeight: "900px" }}>
      {/* {console.log("hiiii chatpage")} */}
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        p="10px"
        h="70%"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
