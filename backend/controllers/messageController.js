const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");

const generateToken = require("../config/generateToken");

const sendMessage = asyncHandler(async (req, res) => {
  let { messageToSend, chatId } = req.body;
  if (!(messageToSend && chatId)) {
    console.log("Missing params");
    return res.sendStatus(400);
  }
  let userId = req.user._id;

  let messageObj = {
    content: messageToSend,
    chat: chatId,
    sender: userId,
  };

  try {
    let message = await Message.create(messageObj);

    message = await message.populate("sender", "name pic");
    message = await message.populate(
      "chat",
      "chatName isGroupChat users latestMessage"
    );
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    let messageList = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat", "chatName isGroupChat");
    res.json(messageList);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
