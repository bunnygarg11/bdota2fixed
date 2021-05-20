const Db = require("../../../services/dotaBot").Db;
const matchTracker = require("../../../services/dotaBot").matchTracker;
const lobbyManager = require("../../../services/dotaBot").lobbyManager;
const CONSTANTS = require("../../../services/dotaBot").CONSTANTS;
const Lobby = require("../../../services/dotaBot").Lobby;
const logger = require("../../../services/dotaBot").logger;
var Services = require("../../../services/network");

const _getMatchStatsPlatform = async (req, res, next) => {
  //   const db = await coreDB.openDBConnnection();
  try {
    const { steamId } = req.query;

    if (!steamId) {
      return Services._validationError(res, "Already registered for lobby");
    }

    let pendingLobbyPlayerMatchStats = await Db.getPendingLobbyPlayerMatchStats(
      steamId
    );

    if (pendingLobbyPlayerMatchStats.length) {
      pendingLobbyPlayerMatchStats = pendingLobbyPlayerMatchStats.map((e) =>
        e.lobbyId.toString ? e.lobbyId.toString() : e.lobbyId
      );
      pendingLobbyPlayerMatchStats = new Set(pendingLobbyPlayerMatchStats);
      pendingLobbyPlayerMatchStats = Array.from(pendingLobbyPlayerMatchStats);

      let lobbystates = await Db.findAllLobbies(pendingLobbyPlayerMatchStats);

      if (lobbystates.length) {
        for (let e of lobbystates) {
          let lobbystate = await matchTracker.setMatchDetails(e);
          if (lobbystate.odotaData)
            await matchTracker.setMatchPlayerDetails(lobbystate);
        }

        await Db.updateManyLobby(pendingLobbyPlayerMatchStats);
      }
    }

    let LobbyPlayerMatchStats = await Db.getLobbyPlayerMatchStats(steamId);

    return Services._response(
      res,
      LobbyPlayerMatchStats,
      "waiting for the other player"
    );
  } catch (error) {
    logger.error(error);
    Services._handleError(res, "Error");
  }
};

module.exports = { _getMatchStatsPlatform };
