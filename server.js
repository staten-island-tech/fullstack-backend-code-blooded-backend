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

let rooms = [];
let allUsers = [];

io.on("connection", (socket) => {
  let hostRoom = null;
  let userIndex = null;
  console.log(`user ${socket.id} is connected`);
  console.log(`user is connected`);
  socket.emit("urSocket", socket.id);

  // placing the host that is
  socket.on("placeUser", (username, code) => {
    socket.join(code);
    rooms.push(code);
    let oneUser = [username, socket.id, code];
    allUsers.push(oneUser);
    console.log(
      "these are rooms: " + rooms + "     these are users: " + allUsers
    );
    socket.emit("userList", allUsers);

    hostRoom = rooms.lastIndexOf(code);
    userIndex = allUsers.lastIndexOf(oneUser);
  });

  // time to check room existence woahh
  socket.on("checkRoom", (arg) => {
    let verified = rooms.includes(arg);
    socket.emit("checked", verified);
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} left.`);
    rooms.splice(hostRoom, 1);
    allUsers.splice(userIndex, 1);
  });
});

server.listen(3001, () => {
  console.group("Server is running on 3001");
});
