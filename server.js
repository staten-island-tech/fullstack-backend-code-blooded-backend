const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const io = require("socket.io")(3300);
const mongoose = require("mongoose");

app.use(bodyParser.json());

// collections
const Players = require("./PlayerModel");

// database connection

mongoose.connect(
  "mongodb://localhost:27017/Uno",
  { useNewUrlParser: true },
  function (err) {
    if (err) {
      throw err;
    }
    console.log("Database connected");

    io.on("connection", (socket) => {
      console.log("user connected");
      socket.on("joinRoom", (data) => {
        // data will look like => {myID: "123123"}
        console.log("user joined room");
        socket.join(data.myID);
      });
    });
    Players.watch().on("change", (change) => {
      console.log("Something has changed");
      io.to(change.fullDocument._id).emit("changes", change.fullDocument);
    });
  }
);
