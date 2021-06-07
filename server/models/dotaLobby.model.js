let mongoose = require("mongoose");
const mongooseHistory = require("mongoose-history");

let Schema = mongoose.Schema;

let dotalobby = new Schema({
  lobbyName: {
    type: String,
  },

  // roleId: String,

  dotaLobbyId: String,

  password: String,

  readyCheckTime: { type: Date },
  readyCheckTimeout: { type: Number, default: 60000 }, //*********in ms */

  state: {
    // allowNull: false,
    type: String,
    defaultValue: "STATE_NEW",
  },

  prevstate: [String],

  gameMode: {
    // allowNull: false,
    type: String,
    default: "DOTA_GAMEMODE_1V1MID",
  },

  matchId: String,

  leagueid:Number,

  winner: {
    // allowNull: false,
    type: Number,
    default: 0,
  },

  failReason: String,

  startedAt: Date,

  finishedAt: Date,

  valveData: Object,

  odotaData: Object,

  joinedPlayers: Object,



  setMatchPlayerDetails: {
    type: Boolean,
    default: false,
  },

  botId: {
    type: Schema.Types.ObjectId,
    ref: "dotabot",
    // unique: true,
  },

  players: [{ type: String }],

  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
});

// dotalobby.plugin(mongooseHistory);

module.exports = mongoose.model("dotalobby", dotalobby);
