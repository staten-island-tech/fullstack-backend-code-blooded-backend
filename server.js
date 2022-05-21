const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const allUsers = [];

io.on("connection", (socket) => {
  console.log(`user ${socket.id} is connected`);
  console.log(`user is connected`);
  socket.emit("urSocket", socket.id);

  socket.on("testingEvent", (arg) => {
    console.log("ok");
  });

  socket.on("addUser", (arg) => {
    allUsers.push(arg);
    console.log(allUsers);
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} left.`);
  });
});

server.listen(3001, () => {
  console.group("Server is running on 3001");
});
