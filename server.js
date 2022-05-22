const express = require("express");
const http = require("http");
const { Server, Socket } = require("socket.io");

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
let roomsInfo = [];

io.on("connection", (socket) => {
  // my code looks like a mess heres my attempt to fix it smh
  let hostRoomIndex = null;
  let userIndex = null;
  let imHost = null;
  let roomInfoIndex = null;

  console.log(`user ${socket.id} is connected`);
  console.log(`user is connected`);

  // placing the host that is
  socket.on("placeHost", (username, code, hostStatus) => {
    imHost = hostStatus;

    socket.join(code);
    rooms.push(code);

    let addRoomInfo = [code, [username, hostStatus]];
    roomsInfo.push(addRoomInfo);

    let oneUser = [username, socket.id, code];
    allUsers.push(oneUser);

    hostRoomIndex = rooms.lastIndexOf(code);
    userIndex = allUsers.lastIndexOf(oneUser);
    roomInfoIndex = roomsInfo.lastIndexOf(addRoomInfo);

    console.log(
      "these are the rooms: " +
        rooms +
        "these are all the users: " +
        allUsers +
        "all the room info: " +
        roomsInfo
    );
  });

  // time to check room existence woahh
  socket.on("checkRoom", (arg) => {
    let verified = rooms.includes(arg);
    socket.emit("checked", verified);
  });

  // placing the guest in a room
  socket.on("placeGuest", (username, code, hostStatus) => {
    imHost = hostStatus;

    socket.join(code);

    hostRoomIndex = rooms.indexOf(code);

    let addRoomInfo = [username, hostStatus];
    roomsInfo[hostRoomIndex].push(addRoomInfo);

    let oneUser = [username, socket.id, code];
    allUsers.push(oneUser);
    userIndex = allUsers.lastIndexOf(oneUser);

    roomInfoIndex = roomsInfo[hostRoomIndex].lastIndexOf(addRoomInfo);

    console.log(
      "these are the rooms: " +
        rooms +
        "these are all the users: " +
        allUsers +
        "all the room info: " +
        roomsInfo
    );
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} left.`);
    allUsers.splice(userIndex, 1);

    if (imHost === true) {
      rooms.splice(hostRoomIndex, 1);
      roomsInfo.splice(hostRoomIndex, 1);
    } else {
      let roomPosition = roomsInfo[hostRoomIndex];
      roomPosition.splice(roomInfoIndex, 1);
    }

    console.log(
      "these are the rooms: " +
        rooms +
        "these are all the users: " +
        allUsers +
        "all the room info: " +
        roomsInfo
    );
  });
});

server.listen(3001, () => {
  console.group("Server is running on 3001");
});
