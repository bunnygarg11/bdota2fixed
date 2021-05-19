const Db = require("../../../services/dotaBot").Db;
const matchTracker = require("../../../services/dotaBot").matchTracker;
const lobbyManager = require("../../../services/dotaBot").lobbyManager;
const CONSTANTS = require("../../../services/dotaBot").CONSTANTS;
const Lobby = require("../../../services/dotaBot").Lobby;
const logger = require("../../../services/dotaBot").logger;
var Services = require("../../../services/network");

const _getMatchStats = async (req, res, next) => {
  //   const db = await coreDB.openDBConnnection();
  try {
    const { matchId } = req.query;

    if (!matchId) {
      return Services._validationError(res, "Provide valid matchId");
    }

    let lobbyState = await Db.findLobbyById(matchId);

    if (!lobbyState || !lobbyState.state) {
      return Services._validationError(res, "Provide valid matchId");
    }

    if (
      lobbyState.state == CONSTANTS.STATE_COMPLETED ||
      lobbyState.state == CONSTANTS.STATE_MATCH_ENDED
    ) {
      let result = await Db.getLobbyMatchStats(matchId);

      if (result.length) return Services._response(res, result);

      return Services._noContent(res, "No stats");
    }

    let msg = `The match is currently `;

    switch (lobbyState.state) {
      case CONSTANTS.STATE_NEW:
      case CONSTANTS.STATE_WAITING_FOR_QUEUE:
      case CONSTANTS.STATE_BEGIN_READY:
      case CONSTANTS.STATE_CHECKING_READY:
      case CONSTANTS.STATE_ASSIGNING_CAPTAINS:
      case CONSTANTS.STATE_SELECTION_PRIORITY:
      case CONSTANTS.STATE_DRAFTING_PLAYERS:
      case CONSTANTS.STATE_AUTOBALANCING:
      case CONSTANTS.STATE_TEAMS_SELECTED:
      case CONSTANTS.STATE_WAITING_FOR_BOT:
      case CONSTANTS.STATE_BOT_ASSIGNED:
      case CONSTANTS.STATE_BOT_CREATED:
      case CONSTANTS.STATE_BOT_STARTED:
      case CONSTANTS.STATE_BOT_CONNECTED:
      case CONSTANTS.STATE_WAITING_FOR_PLAYERS:
      case CONSTANTS.STATE_MATCH_IN_PROGRESS:
      case CONSTANTS.STATE_MATCH_ENDED:
      case CONSTANTS.STATE_MATCH_STATS:
      case CONSTANTS.STATE_COMPLETED:
        msg = `The match is currently in progress`;

      case CONSTANTS.STATE_BOT_FAILED:
      case CONSTANTS.STATE_MATCH_NO_STATS:
      case CONSTANTS.STATE_FAILED:
      case CONSTANTS.STATE_KILLED:
      case CONSTANTS.STATE_PENDING_KILL:
      default:
        msg = `The match is cancelled`;
    }

    return Services._validationError(res, msg);
  } catch (error) {
    logger.error(error);
    Services._handleError(res, "Error");
  }
};

module.exports = { _getMatchStats };
