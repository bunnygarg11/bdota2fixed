let mongoose = require("mongoose");
const mongooseHistory = require("mongoose-history");

let Schema = mongoose.Schema;

let dotaDefault = new Schema({
  lobbyNameTemplate: {
    type: String,
    default: "Inhouse Lobby ${lobbyId}",
  },

  leagueid: Number,

  readyCheckTimeout: { type: Number, default: 60000 }, //*********in ms */

  defaultGameMode: {
    type: String,
    default: "DOTA_GAMEMODE_1V1MID",
  },
  PlayersLength: { type: Number, default: 2 },

  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
});

// dotaDefault.plugin(mongooseHistory);

module.exports = mongoose.model("dotaDefault", dotaDefault);
