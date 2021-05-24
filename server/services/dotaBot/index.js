const LobbyManager = require("./lobbyManager");
const Db = require("./db");

const CONSTANTS = require("./constants");
const Lobby = require("./lobby");
const logger = require("./logger");
const matchTracker = require("./matchTracker");

(async()=>{
await require("./serverRestart").onRestart(Db);
})()


let lobbyManager = new LobbyManager();

module.exports = {
  Db,
  lobbyManager,
  CONSTANTS,
  Lobby,
  logger,
  matchTracker,
};
