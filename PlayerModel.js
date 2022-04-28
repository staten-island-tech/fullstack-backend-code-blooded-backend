const mongoose = require("mongoose");

const PlayerSchema = mongoose.Schema({
  _id: String,
  name: String,
});

module.exports = mongoose.model("Players", PlayerSchema);
