const express = require("express");
const dotenv = require("dotenv");

const { chats } = require("./data/data");
const app = express();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
dotenv.config();

connectDB();

app.use(express.json()); //to accept json data

// app.get("/", (req, res) => {
//   res.send("API / is running");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
//if the upper routes dont work - these are the error handler.
app.use(notFound);
app.use(errorHandler);

// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });

// app.get("/api/chat/:id", (req, res) => {
//   const neededchat = chats.find((c) => c._id === req.params.id);
//   res.send(neededchat);
// });

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`server created on port ${PORT}`));
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("Connected to socket.io setup", userData._id);

    socket.emit("connected", userData);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    console.log("new message", newMessageRecieved);
    var chat = newMessageRecieved.chat;

    if (!chat || !chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      console.log("socket emit", user);
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
