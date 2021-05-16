const Db = require("../../../services/dotaBot").Db;
const lobbyManager = require("../../../services/dotaBot").lobbyManager;
const CONSTANTS = require("../../../services/dotaBot").CONSTANTS;
const Lobby = require("../../../services/dotaBot").Lobby;
const logger = require("../../../services/dotaBot").logger;
const dotaLobbyModel = require("../../../models/dotaLobby.model");
const dotaBotModel = require("../../../models/dotaBot.model");
const dotaLobbyPlayerModel = require("../../../models/dotaLobbyPlayer.model");
var Services = require("../../../services/network");

const _bpractice = async (req, res, next) => {
  try {
    let matchId = "5984453808";

    // let lobby = await dotaLobbyModel.findOne({
    //   gameMode: "DOTA_GAMEMODE_1V1MID",
    // }).lean(true).exec();

    // await lobbyManager[CONSTANTS.EVENT_RUN_LOBBY](lobby, [
    //   CONSTANTS.STATE_MATCH_STATS,
    // ]).catch((e) => logger.error(e));

    let result = await dotaLobbyPlayerModel.aggregate([
      {
        $match: {
          matchId,
        },
      },

      {
        $project: {
          win: {
            $cond: [{ $eq: ["$win", true] }, 1, 0],
          },
          lose: {
            $cond: [{ $eq: ["$lose", true] }, 1, 0],
          },
          kills: 1,
          deaths: 1,
          assists: 1,
          abandons: 1,
          duration: 1,
          gold: 1,
          herodamage: 1,
          herohealing: 1,
          towerdamage: 1,
          gpm: 1,
          xpm: 1,
          kda: 1,
        },
      },

      {
        $group: {
          _id: null,
          totalmatches: { $sum: 1 },
          totalKills: { $sum: "$kills" },
          totalWins: { $sum: "$win" },
          totalLoses: { $sum: "$lose" },
          totalDeaths: { $sum: "$deaths" },
          totalAssits: { $sum: "$assists" },
          totalAbandons: { $sum: "$abandons" },
          totalDenies: { $sum: "$denies" },
          totalDuration: { $sum: "$duration" },
          totalGold: { $sum: "$gold" },
          totalHeroDmg: { $sum: "$herodamage" },
          totalHeroHealing: { $sum: "$herohealing" },
          totalTowDmg: { $sum: "$towerdamage" },
          totalHeroHits: { $sum: "$herohits" },
          avgGpm: { $avg: "$gpm" },
          avgXpm: { $avg: "$xpm" },
          avgKda: { $avg: "$kda" },
        },
      },
    ]);

    // const startedAtExpiration = new Date();
    // startedAtExpiration.setHours(startedAtExpiration.getHours() - 4);

    // console.log(lobby.startedAt > startedAtExpiration);
    // console.log(lobby.startedAt -startedAtExpiration);
    // console.log(typeof lobby.startedAt);
    // console.log(typeof startedAtExpiration);
    // let bot = await dotaBotModel.findOne({ status: "BOT_IDLE" }).lean(true).exec();

    // console.log("lobbyState", lobby);

    // console.log("dotaState", bot);

    // let flag=Object.keys(lobbyManager.bots)

    // console.log(flag);
    // console.log(lobbyManager.bots);

    return Services._response(
      res,
      result,

      "Invitation sent. Please open your dota client to play the game"
    );
  } catch (error) {
    logger.error(error);
    Services._handleError(res, "Error");
  }
};

module.exports = { _bpractice };
