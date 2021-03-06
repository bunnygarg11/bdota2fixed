const Db = require("../../../services/dotaBot").Db;
const lobbyManager = require("../../../services/dotaBot").lobbyManager;
const CONSTANTS = require("../../../services/dotaBot").CONSTANTS;
const Lobby = require("../../../services/dotaBot").Lobby;
const logger = require("../../../services/dotaBot").logger;
var Services = require("../../../services/network");

const _createsteamlobbyy = async (req, res, next) => {
  //   const db = await coreDB.openDBConnnection();
  try {
    const { players } = req.body;

    if (
      typeof players !== "object" ||
      !Array.isArray(players) ||
      players.length < 2
    ) {
      return Services._validationError(res, "provide valid list of players");
    }

    let lobbyState = await Db.findActiveLobbiesFormultiUser(players);

    if (lobbyState && lobbyState.length) {
      return Services._validationError(res, "Already registered for lobby");
    }

    // lobbyState = await Db.findPendingLobby();

    // if (lobbyState && lobbyState._id) {
    //   lobbyState = await Db.addPlayer(lobbyState, steamId);
    // } else {
    lobbyState = await Db.findOrCreatemultiLobby(players);
    // lobbyState = await Fp.pipeP(
    //   Lobby.assignLobbyName,
    //   Lobby.assignGameMode
    // )(lobbyState);
    lobbyState = await Lobby.assignLobbyName(lobbyState);
    lobbyState = await Lobby.assignGameMode(lobbyState);
    lobbyState = await Lobby.assignReadyCheckTimeout(lobbyState);
    await Db.updateLobby(lobbyState);
    // }

    if (
      lobbyState.players.length >= (process.env.PLAYER_COUNT_FOR_LOBBY || 2)
    ) {
      lobbyState.state = CONSTANTS.STATE_WAITING_FOR_BOT;
      await Db.updateLobby(lobbyState);
      let assignedbot = await Db.findassignedBot();

      let msg = assignedbot.length
        ? "Bot is busy. Wait for sometime to recieve the invitation"
        : "Invitation sent. Please open your dota client to play the game";

      // lobbyManager.runLobby(lobbyState, [CONSTANTS.STATE_WAITING_FOR_BOT]);
      await lobbyManager[CONSTANTS.EVENT_RUN_LOBBY](lobbyState, [
        CONSTANTS.STATE_WAITING_FOR_BOT,
      ]);

      return Services._response(
        res,
        { matchId: lobbyState._id.toString() },
        msg
      );
    }
  } catch (error) {
    logger.error(error);
    Services._handleError(res, "Error");
  }
};

module.exports = { _createsteamlobbyy };
