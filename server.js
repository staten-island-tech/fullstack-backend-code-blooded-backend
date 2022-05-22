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

  // for the guest
  let myRoom;
  let guestInfoIndex = null;

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

    io.to(code).emit("currentRoom", roomsInfo[roomInfoIndex]);
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

    // which room u in
    hostRoomIndex = rooms.indexOf(code);

    // adding roominfo to roominfo
    let addRoomInfo = [username, hostStatus];
    myRoom = roomsInfo[hostRoomIndex];
    myRoom.push(addRoomInfo);

    let oneUser = [username, socket.id, code];
    allUsers.push(oneUser);
    userIndex = allUsers.lastIndexOf(oneUser);

    // in the room array, position of the guest info
    guestInfoIndex = myRoom.lastIndexOf(addRoomInfo);

    console.log(
      " //these are the rooms:// " +
        rooms +
        " //these are all the users:// " +
        allUsers +
        " //all the room info:// " +
        roomsInfo
    );
    io.to(code).emit("currentRoom", roomsInfo[hostRoomIndex]);
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} left.`);
    allUsers.splice(userIndex, 1);

    if (imHost === true) {
      rooms.splice(hostRoomIndex, 1);
      roomsInfo.splice(hostRoomIndex, 1);
    } else {
      myRoom.splice(guestInfoIndex, 1);
    }

    console.log(
      " //these are the rooms:// " +
        rooms +
        " //these are all the users:// " +
        allUsers +
        " //all the room info:// " +
        roomsInfo
    );
  });
});

server.listen(3001, () => {
  console.group("Server is running on 3001");
});
