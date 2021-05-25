const LobbyManager = require("./lobbyManager");
const Db = require("./db");

const CONSTANTS = require("./constants");
const Lobby = require("./lobby");
const logger = require("./logger");
const matchTracker = require("./matchTracker");
let lobbyManager = new LobbyManager();


(async()=>{

  await lobbyManager.onClientReady()

})()



module.exports = {
  Db,
  lobbyManager,
  CONSTANTS,
  Lobby,
  logger,
  matchTracker,
};
