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

io.on("connection", (socket) => {
  console.log(`user ${socket.id} is connected`);

  socket.on("roomCode", async (arg) => {
    try {
      console.log(arg); // the code
      socket.emit("myCode", "poop");
    } catch (error) {
      console.log(error);
      callback({
        status: "NOK",
      });
    }

    //socket.emit("myCode", arg);
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} left.`);
  });
});

server.listen(3001, () => {
  console.group("Server is running on 3001");
});
