const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const generateToken = require("../config/generateToken");

const removeFromGroup = asyncHandler(async (req, res) => {
  const { userId, groupChatId } = req.body;
  if (!userId || !groupChatId) {
    console.log("user could not recieve");
    return res.status(400).send({ message: "name or group is not available" });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    groupChatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  // console.log(updatedChat.users);

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { userId, groupChatId } = req.body;
  if (!userId || !groupChatId) {
    console.log("user could not recieve");
    return res.status(400).send({ message: "name or group is not available" });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    groupChatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  // console.log(updatedChat.users);

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { newName, chatId } = req.body;
  if (!newName || !chatId) {
    console.log("users could not recieve");
    return res.status(400).send({ message: "name or group is not available" });
  }

  const renamedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: newName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!renamedChat) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(renamedChat);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { name, users } = req.body;
  if (!name || !users) {
    console.log("users could not recieve");
    return res.status(400).send({ message: "name or users is not available" });
  }
  var users1 = JSON.parse(users);
  if (users1.length < 2) {
    return res
      .status(400)
      .send({ message: "There must be more than 2 people on a group chat" });
  }
  users1.push(req.user._id);
  try {
    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users: users1,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    console.log(118);
    var result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    result = await User.populate(result, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    console.log(130);
    res.status(200).send(result);

    // Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    //   .populate("users", "-password")
    //   .populate("groupAdmin", "-password")
    //   .populate("latestMessage")
    //   .sort({ updatedAt: -1 })
    //   .then(async (results) => {
    //     results = await User.populate(results, {
    //       path: "latestMessage.sender",
    //       select: "name pic email",
    //     });
    //     res.status(200).send(results);
    //   });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const accessChat = asyncHandler(async (req, res) => {
  console.log("in the accesschat");
  console.log(req);
  const { userId } = req.body;
  if (!userId) {
    console.log("userID could not recieve");
    return res.sendStatus(400);
  }

  var isChat = Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

module.exports = {
  fetchChats,
  accessChat,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};
