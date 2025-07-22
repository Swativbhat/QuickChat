const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();
const PORT = process.env.PORT;
const server = http.createServer(app);
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = {};
io.on("connection", (socket) => {
  socket.on("join-room", ({ name, room }) => {
    socket.join(room);

    if (!users[room]) users[room] = []; //important

    users[room] = users[room].filter((user) => user.name !== name); //only unique users allowed

    users[room].push({ id: socket.id, name });

    const roomUsers = users[room].map((user) => user.name);

    io.to(room).emit("room-users", roomUsers);

    console.log(`${name} joined ${room} id:${socket.id}`);
  });

  socket.on("send-message", ({ name, room, message }) => {
    io.to(room).emit("receive-message", { name, message });
  });

  socket.on("leave-room", ({ name, room }) => {
    socket.leave(room);
    if (users[room]) {
      users[room] = users[room].filter((user) => user.name != name);
      const roomUsers = users[room].map((user) => user.name);
      io.to(room).emit("room-users", roomUsers);
      console.log(`${name} left the ${room}..!`);
    }
  });
});

server.listen(PORT, () => {
  console.log("server connected");
});
