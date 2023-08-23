import React from "react";

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  ) {
    // console.log("isSameSenderMargin", 33);
    return 33;
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  ) {
    // console.log("isSameSenderMargin", 0);
    return 0;
  } else {
    // console.log("isSameSenderMargin", "auto");

    return "auto";
  }
};

export const isSameSender = (messages, m, i, userId) => {
  let a =
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId;

  // console.log("isSameSender", a);
  return a;
};

//is it last of a group of continuous message he has sent or not
export const isLastMessage = (messages, i, userId) => {
  let a =
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id;

  // console.log("isLastMessage", a);
  return a;
};

export const isSameUser = (messages, m, i) => {
  let a = i > 0 && messages[i - 1].sender._id === m.sender._id;
  // console.log("isSameUser", a);
  return a;
};

export const getSender = (users, loggedUser) => {
  let a = users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  // console.log("getSender", a);
  return a;
};
export const getSenderFull = (users, loggedUser) => {
  let a = users[0]._id === loggedUser._id ? users[1] : users[0];
  // console.log("getSenderFull", a);
  return a;
};
