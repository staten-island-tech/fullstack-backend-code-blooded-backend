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
let roomsInfo = [];

io.on("connection", (socket) => {
  // index of the room in "rooms"
  let hostRoomIndex = null;

  let imHost = null;
  let roomInfoIndex = null;
  let myRoomCode = null;

  // for the guest
  let guestInfoIndex = null;

  console.log(`user ${socket.id} is connected`);
  console.log(`user is connected`);

  // placing the host that is
  socket.on("placeHost", (username, code, hostStatus) => {
    // sets host status
    imHost = hostStatus;
    myRoomCode = code;

    // joining and pushing room code into room
    socket.join(code);
    rooms.push(code);

    // pushing array with username into room info
    let addRoomInfo = [username];
    roomsInfo.push(addRoomInfo);

    // index of the room in "rooms"
    hostRoomIndex = rooms.lastIndexOf(code);
    // index of the array of usernames (specific room) in roomInfo
    roomInfoIndex = roomsInfo.lastIndexOf(addRoomInfo);

    console.log(
      "these are the rooms: " + rooms + "all the room info: " + roomsInfo
    );

    io.to(code).emit("currentRoom", roomsInfo[roomInfoIndex]);
  });

  // time to check room existence woahh
  socket.on("checkRoom", (arg) => {
    let verified = rooms.includes(arg);

    let myRoomIndex = rooms.indexOf(myRoomCode) + 1;
    // console.log(myRoomIndex);
    let thisRoom = roomsInfo[myRoomIndex];
    let full = thisRoom.length > 3;

    socket.emit("checked", verified, full);
  });

  // placing the guest in a room
  socket.on("placeGuest", (username, code, hostStatus) => {
    imHost = hostStatus;
    myRoomCode = code;

    socket.join(code);

    // which room u in
    hostRoomIndex = rooms.indexOf(code);

    // adding roominfo to roominfo
    roomsInfo[hostRoomIndex].push(username);

    // in the array of usernames in a room, position of the guest username
    let myRoom = roomsInfo[hostRoomIndex];
    guestInfoIndex = myRoom.length - 1;

    console.log(
      " //these are the rooms:// " +
        rooms +
        " //all the room info:// " +
        roomsInfo
    );
    io.to(code).emit("currentRoom", roomsInfo[hostRoomIndex]);
  });

  // chat mech here
  socket.on("myMessage", (message, code) => {
    io.to(code).emit("newMessage", message);
  });

  // game is startingg
  socket.on("startGame", (status) => {
    io.to(myRoomCode).emit("startNow", status);
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} left.`);

    if (imHost === true) {
      let myRoomIndex = rooms.indexOf(myRoomCode);
      rooms.splice(myRoomIndex, 1);
      roomsInfo.splice(myRoomIndex, 1);
    } else {
      if (rooms.includes(myRoomCode)) {
        let myRoomIndex = rooms.indexOf(myRoomCode);
        roomsInfo[myRoomIndex].splice(guestInfoIndex, 1);
        console.log("testing" + roomsInfo);
      }
    }

    console.log(
      " //these are the rooms:// " +
        rooms +
        " //all the room info:// " +
        roomsInfo
    );
  });
});

server.listen(3001, () => {
  console.group("Server is running on 3001");
});
