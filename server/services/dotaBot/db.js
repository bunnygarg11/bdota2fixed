var dotaBotModel = require("../../models/dotaBot.model");
var dotaLobbyModel = require("../../models/dotaLobby.model");
var dotaLobbyPlayerModel = require("../../models/dotaLobbyPlayer.model");
var dotaMatchModel = require("../../models/dotaMatch.model");
var dotaBotAdminModel = require("../../models/dotaBotAdmin.model");
var dotaDefaultsModel = require("../../models/dotaDefaults.model");
const util = require("util");

const logger = require("./logger");
const CONSTANTS = require("./constants");
const { hri } = require("human-readable-ids");

//***********TEST QUERY*************************************************************************************************************************************************************************** */
//***********TEST QUERY*************************************************************************************************************************************************************************** */
//***********TEST QUERY*************************************************************************************************************************************************************************** */
module.exports.deleteLobbies = (lobbyStateIds) =>
  dotaLobbyModel
    .updateMany(
      {
        _id: {
          $in: lobbyStateIds,
        },
      },
      {
        state: CONSTANTS.DELETED,
      }
    )
    .exec();
module.exports.updateQuery = () =>
  dotaLobbyModel.findOneAndUpdate(
    { gameMode: "DOTA_GAMEMODE_1V1MID" },
    {
      botId: null,
      state: "STATE_WAITING_FOR_QUEUE",
      $pull: {
        players: "76561198177128005",
      },
    },
    {
      new: true,
    }
  );

module.exports.testFindAllActiveLobbies = () =>
  dotaLobbyModel
    .find({
      state: {
        $in: [
          "STATE_BOT_ASSIGNED",
          "STATE_BOT_CREATED",
          "STATE_BOT_STARTED",
          "STATE_BOT_CONNECTED",
          "STATE_WAITING_FOR_PLAYERS",
          "STATE_MATCH_IN_PROGRESS",
          "STATE_WAITING_FOR_QUEUE",
          "STATE_WAITING_FOR_BOT",
        ],
      },
    })
    .lean(true)
    .exec();

module.exports.testFindActiveBots = () =>
  dotaBotModel
    .find({
      status: {
        $in: [
          CONSTANTS.BOT_LOADING,
          CONSTANTS.BOT_ONLINE,
          CONSTANTS.BOT_IDLE,
          CONSTANTS.BOT_IN_LOBBY,
          CONSTANTS.BOT_OFFLINE,
          CONSTANTS.BOT_FAILED,
        ],
      },
    })
    .lean(true)
    .exec();

//**************TEST QUERY************************************************************************************************************************************************************************ */
//**************TEST QUERY************************************************************************************************************************************************************************ */
//**************TEST QUERY************************************************************************************************************************************************************************ */

//**********************************************************BOT MODEL***************************************************************************************************************************** */
//**********************************************************BOT MODEL***************************************************************************************************************************** */
//**********************************************************BOT MODEL***************************************************************************************************************************** */
module.exports.findOrCreateBot = async (
  steamId64,
  accountName,
  personaName,
  password
) => {
  try {
    let result = await dotaBotModel.create({
      steamId64,
      accountName,
      personaName,
      password,
    });

    logger.debug(
      `DB findOrCreateBot steamId64 ${steamId64} accountName ${accountName} personaName ${personaName} password ${password} --> ${util.inspect(
        result._doc
      )}`
    );

    return result._doc;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.updateBotStatusBySteamId = async (status, steamId64) => {
  try {
    const result = await dotaBotModel
      .findOneAndUpdate(
        {
          steamId64,
          status: { $ne: CONSTANTS.DELETED },
        },
        {
          status,
        },
        {
          new: true,
        }
      )
      .lean(true)
      .exec();
    logger.debug(
      `DB updateBotStatusBySteamId status ${status} steamId64 ${steamId64}  --> ${util.inspect(
        result
      )}`
    );
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.updateBotStatus = async (status, _id) => {
  try {
    const result = await dotaBotModel
      .findOneAndUpdate(
        {
          _id,
          status: { $ne: CONSTANTS.DELETED },
        },
        {
          status,
        },
        {
          new: true,
        }
      )
      .lean(true)
      .exec();
    logger.debug(
      `DB updateBotStatus status ${status} _id ${_id}  --> ${util.inspect(
        result
      )}`
    );
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findBot = async (_id) => {
  try {
    const result = await dotaBotModel
      .findOne({
        _id,
        status: { $ne: CONSTANTS.DELETED },
      })
      .lean(true)
      .exec();
    logger.debug(`DB findBot  _id ${_id}  --> ${util.inspect(result)}`);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findBotBySteamId64 = async (steamId64) => {
  try {
    const result = await dotaBotModel
      .findOne({
        steamId64,
        status: { $ne: CONSTANTS.DELETED },
      })
      .lean(true)
      .exec();
    logger.debug(
      `DB findBotBySteamId64 steamId64 ${steamId64}  --> ${util.inspect(
        result
      )}`
    );
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findUnassignedBot = async () => {
  try {
    const result = await dotaBotModel
      .findOne({
        status: {
          $in: [CONSTANTS.BOT_OFFLINE, CONSTANTS.BOT_IDLE],
        },
        // lobbyCount: {
        //   $lt: 5,
        // },
      })
      .lean(true)
      .exec();
    logger.debug(`DB findUnassignedBot   --> ${util.inspect(result)}`);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findassignedBot = async () => {
  try {
    const result = await dotaBotModel
      .find({
        status: {
          $in: [
            CONSTANTS.BOT_LOADING,
            CONSTANTS.BOT_ONLINE,
            CONSTANTS.BOT_IN_LOBBY,
          ],
        },
      })
      .lean(true)
      .exec();
    logger.debug(`DB findassignedBot   --> ${util.inspect(result)}`);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.assignBotToLobby = async (lobby, botId) => {
  try {


    const result = await dotaBotModel
      .findOneAndUpdate(
        {
          _id: botId,
          status: { $ne: CONSTANTS.DELETED },
        },
        {
          $inc: {
            lobbyCount: 1,
          },
        },
        {
          new: true,
        }
      )
      .lean(true)
      .exec();

    const {leagueid} = await dotaBotAdminModel
      .findOne({
        status: "ACTIVE",
        steamId64:result.steamId64
      })
      .lean(true)
      .exec();
  const resul=  await dotaLobbyModel
      .findOneAndUpdate(
        {
          _id: lobby._id,
          state: { $ne: CONSTANTS.DELETED },
        },
        {
          botId,
          leagueid
        },
        {
          new: true,
        }
      )
      .lean(true)
      .exec();
    
    logger.debug(
      `DB assignBotToLobby lobby ${util.inspect(
        lobby
      )} botId ${botId}  --> ${util.inspect(result)} resul ${util.inspect(
        resul
      )}`
    );
    return resul;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.unassignBotFromLobby = async (lobby, botId) => {
  try {
    await dotaLobbyModel
      .findOneAndUpdate(
        {
          _id: lobby._id,
          state: { $ne: CONSTANTS.DELETED },
        },
        {
          botId: null,
          dotaLobbyId: null,
        },
        {
          new: true,
        }
      )
      .lean(true)
      .exec();

    const result = await dotaBotModel
      .findOneAndUpdate(
        {
          status: { $ne: CONSTANTS.DELETED },
          _id: botId,
        },
        {
          $inc: {
            lobbyCount: -1,
          },
        },
        {
          new: true,
        }
      )
      .lean(true)
      .exec();
    logger.debug(
      `DB unassignBotFromLobby lobby ${lobby} botId ${botId}  --> ${util.inspect(
        result
      )}`
    );
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.setAllBotsOffline = async () => {
  try {
    const result = await dotaBotModel.updateMany(
      {
        status: {
          $nin: [CONSTANTS.BOT_OFFLINE, CONSTANTS.DELETED],
        },
      },
      {
        status: CONSTANTS.BOT_OFFLINE,
      }
    );
    logger.debug(`DB setAllBotsOffline  --> ${util.inspect(result)}`);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.updateBot = async (steamId64, values) => {
  try {
    const result = await dotaBotModel
      .findOneAndUpdate(
        {
          status: { $ne: CONSTANTS.DELETED },
          steamId64,
        },
        values,
        {
          new: true,
        }
      )
      .lean(true)
      .exec();
    logger.debug(
      `DB updateBot values ${util.inspect(
        values
      )} steamId64 ${steamId64}  --> ${util.inspect(result)}`
    );
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.destroyBotBySteamID64 = async (steamId64) => {
  try {
    const result = await dotaBotModel.findOneAndDelete({
      steamId64,
      status: { $ne: CONSTANTS.DELETED },
    });
    logger.debug(
      `DB destroyBotBySteamID64  steamId64 ${steamId64}  --> ${util.inspect(
        result
      )}`
    );
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findDotaBotCredentials = async (steamId64s) => {
  try {

    if(!steamId64s){
      const result = await dotaBotAdminModel
        .findOne({
          
          status: "ACTIVE",
        })
        .lean(true)
        .exec();
      logger.debug(
        `DB findDotaBotCredentials   --> ${util.inspect(
          result
        )} `
      );
      return result;
    }
    const result = await dotaBotAdminModel
      .findOne({
        steamId64: {
          $nin: steamId64s,
        },
        status: "ACTIVE",
      })
      .lean(true)
      .exec();
    logger.debug(
      `DB findDotaBotCredentials   --> ${util.inspect(
        result
      )} steamId64s --> ${util.inspect(steamId64s)}`
    );
    const resultt = await this.findassignedBot();
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};
//**********************************************************LOBBY MODEL***************************************************************************************************************************** */
//**********************************************************LOBBY MODEL***************************************************************************************************************************** */
//**********************************************************LOBBY MODEL***************************************************************************************************************************** */

module.exports.findAllActiveLobbies = async () => {
  try {
    const result = await dotaLobbyModel
      .find({
        state: {
          $nin: [
            CONSTANTS.STATE_COMPLETED,
            CONSTANTS.STATE_COMPLETED_NO_STATS,
            CONSTANTS.STATE_KILLED,
            CONSTANTS.STATE_FAILED,
            CONSTANTS.DELETED,
            CONSTANTS.STATE_BOT_FAILED,
          ],
        },
      })
      .lean(true)
      .exec();
    logger.debug(`DB findAllActiveLobbies  --> ${util.inspect(result)}`);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findActiveLobbiesForUser = async (userId) => {
  try {
    const result = await dotaLobbyModel
      .find({
        state: {
          $nin: [
            CONSTANTS.STATE_COMPLETED,
            CONSTANTS.STATE_COMPLETED_NO_STATS,
            CONSTANTS.STATE_KILLED,
            CONSTANTS.STATE_FAILED,
            CONSTANTS.DELETED,
            CONSTANTS.STATE_BOT_FAILED
          ],
        },
        players: userId,
      })
      .lean(true)
      .exec();
    logger.debug(
      `DB findActiveLobbiesForUser userId ${userId}  --> ${util.inspect(
        result
      )}`
    );
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findActiveLobbiesFormultiUser = async (userIds) => {
  try {
    const result = await dotaLobbyModel
      .find({
        state: {
          $nin: [
            CONSTANTS.STATE_COMPLETED,
            CONSTANTS.STATE_COMPLETED_NO_STATS,
            CONSTANTS.STATE_KILLED,
            CONSTANTS.STATE_FAILED,
            CONSTANTS.DELETED,
          ],
        },
        players: { $in: userIds },
      })
      .lean(true)
      .exec();
    logger.debug(
      `DB findActiveLobbiesForUser userId ${userIds}  --> ${util.inspect(
        result
      )}`
    );
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findPendingLobby = async () => {
  try {
    const result = await dotaLobbyModel
      .findOne({
        state: CONSTANTS.STATE_WAITING_FOR_QUEUE,
      })
      .lean(true)
      .exec();
    logger.debug(`DB findPendingLobby  --> ${util.inspect(result)}`);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findAllInProgressLobbies = async () => {
  try {
    const result = await dotaLobbyModel
      .find({
        state: CONSTANTS.STATE_MATCH_IN_PROGRESS,
      })
      .lean(true)
      .exec();
    logger.debug(`DB findAllInProgressLobbies  --> ${util.inspect(result)}`);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findLobbyByName = async (lobbyName) => {
  try {
    const result = await dotaLobbyModel
      .findOne({
        lobbyName,
        state: { $ne: CONSTANTS.DELETED },
      })
      .lean(true)
      .exec();
    logger.debug(
      `DB findLobbyByName lobbyName ${lobbyName}  --> ${util.inspect(result)}`
    );
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findLobbyByMatchId = async (matchId) => {
  try {
    const result = await dotaLobbyModel
      .findOne({
        matchId,
        state: { $ne: CONSTANTS.DELETED },
      })
      .lean(true)
      .exec();
    logger.debug(
      `DB findLobbyByMatchId matchId ${matchId}   --> ${util.inspect(result)}`
    );
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findOrCreateLobby = async (player) => {
  try {
    let result = await dotaLobbyModel.create({
      state: CONSTANTS.STATE_WAITING_FOR_QUEUE,
      password: hri.random(),
      // lobbyName,
      players: [player],
    });

    return result._doc;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findOrCreatemultiLobby = async (player) => {
  try {
    let result = await dotaLobbyModel.create({
      state: CONSTANTS.STATE_WAITING_FOR_QUEUE,
      password: hri.random(),
      // lobbyName,
      players: player,
    });

    return result._doc;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findLobbyByDotaLobbyId = async (dotaLobbyId) => {
  try {
    const result = await dotaLobbyModel
      .findOne({
        dotaLobbyId,
        state: { $ne: CONSTANTS.DELETED },
      })
      .lean(true)
      .exec();
    logger.debug(
      `DB findLobbyByDotaLobbyId dotaLobbyId ${dotaLobbyId}   --> ${util.inspect(
        result
      )}`
    );
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findLobbyById = async (_id) => {
  try {
    const result = await dotaLobbyModel
      .findOne({
        _id,
        state: { $ne: CONSTANTS.DELETED },
      })
      .lean(true)
      .exec();
    logger.debug(`DB findLobbyById _id ${_id}   --> ${util.inspect(result)}`);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.updateLobbyState = async (lobbyOrState, state) => {
  try {
    const result = await dotaLobbyModel
      .findOneAndUpdate(
        {
          _id: lobbyOrState._id,
          state: { $ne: CONSTANTS.DELETED },
        },
        {
          state,
        },
        {
          new: true,
        }
      )
      .lean(true)
      .exec();

    logger.debug(
      `DB updateLobbyState  state ${state} --> ${util.inspect(result)}`
    );

    // cache.Lobbies.delete(lobbyOrState.id);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.updateLobbyName = async (lobbyOrState, lobbyName) => {
  try {
    const result = await dotaLobbyModel
      .findOneAndUpdate(
        {
          state: { $ne: CONSTANTS.DELETED },
          _id: lobbyOrState._id,
        },
        {
          lobbyName,
        },
        {
          new: true,
        }
      )
      .lean(true)
      .exec();

    logger.debug(
      `DB updateLobbyName  lobbyName ${lobbyName} --> ${util.inspect(result)}`
    );
    // cache.Lobbies.delete(lobbyOrState.id);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.updateLobbyChannel = async (lobbyOrState, channel) => {
  try {
    const result = await dotaLobbyModel
      .findOneAndUpdate(
        {
          _id: lobbyOrState.id,
          state: { $ne: CONSTANTS.DELETED },
        },
        {
          channel,
        },
        {
          new: true,
        }
      )
      .lean(true)
      .exec();
    logger.debug(
      `DB updateLobbyChannel  channel ${channel} --> ${util.inspect(result)}`
    );

    // cache.Lobbies.delete(lobbyOrState.id);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.updateLobbyWinner = async (lobbyOrState, winner) => {
  try {
    const result = await dotaLobbyModel
      .findOneAndUpdate(
        {
          _id: lobbyOrState._id,
          state: { $ne: CONSTANTS.DELETED },
        },
        {
          winner,
        },
        {
          new: true,
        }
      )
      .lean(true)
      .exec();

    logger.debug(
      `DB updateLobbyWinner  winner ${winner} --> ${util.inspect(result)}`
    );

    // cache.Lobbies.delete(lobbyOrState.id);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.updateLobby = async (lobbyOrState) => {
  try {
    const { _id, ...rest } = lobbyOrState;
    const result = await dotaLobbyModel
      .findOneAndUpdate(
        {
          _id,
          state: { $ne: CONSTANTS.DELETED },
        },

        rest,

        {
          new: true,
        }
      )
      .lean(true)
      .exec();
    logger.debug(`DB updateLobby  --> ${util.inspect(result)}`);
    // cache.Lobbies.delete(lobbyOrState.id);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.updateLobbyFailed = async (lobbyOrState, failReason) => {
  try {
    const result = await dotaLobbyModel
      .findOneAndUpdate(
        {
          _id: lobbyOrState._id,
          state: { $ne: CONSTANTS.DELETED },
        },
        {
          state: CONSTANTS.STATE_FAILED,
          failReason,
        },
        {
          new: true,
        }
      )
      .lean(true)
      .exec();
    logger.debug(`DB updateLobbyFailed --> ${util.inspect(result)}`);
    // cache.Lobbies.delete(lobbyOrState.id);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findAllMatchEndedLobbies = async () => {
  try {
    const result = await dotaLobbyModel
      .find({
        state: CONSTANTS.STATE_MATCH_ENDED,
      })
      .lean(true)
      .exec();
    logger.debug(`DB findAllMatchEndedLobbies  --> ${util.inspect(result)}`);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findAllLobbiesInState = async (state) => {
  try {
    const result = await dotaLobbyModel
      .find({
        state,
      })
      .lean(true)
      .exec();
    logger.debug(
      `DB findAllLobbiesInState state ${state}  --> ${util.inspect(result)}`
    );
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.getLobbyPlayers = async (lobbyOrState, options) => {
  try {
    if (options) options.state = options.state || { $ne: CONSTANTS.DELETED };
    let condition = options
      ? {
          _id: lobbyOrState._id,
          ...options,
        }
      : {
          _id: lobbyOrState._id,
          state: { $ne: CONSTANTS.DELETED },
        };
    const result = await dotaLobbyModel
      .findOne(condition)
      .select("players")
      .lean(true)
      .exec();
    logger.debug(`DB getLobbyPlayers    --> ${util.inspect(result)}`);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.addPlayer = async (lobbyOrState, player) => {
  try {
    const result = await dotaLobbyModel
      .findOneAndUpdate(
        {
          _id: lobbyOrState._id,
          state: { $ne: CONSTANTS.DELETED },
        },
        {
          $push: {
            players: player,
          },
        },
        {
          new: true,
        }
      )
      .lean(true)
      .exec();
    logger.debug(`DB addPlayer  player ${player}  --> ${util.inspect(result)}`);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.removePlayer = async (lobbyOrState, player) => {
  try {
    const result = await dotaLobbyModel
      .findOneAndUpdate(
        {
          _id: lobbyOrState._id,
          state: { $ne: CONSTANTS.DELETED },
        },
        {
          $pull: {
            players: player,
          },
        },
        {
          new: true,
        }
      )
      .lean(true)
      .exec();
    logger.debug(
      `DB removePlayer  player ${player}  --> ${util.inspect(result)}`
    );
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.updateManyLobby = async (lobby) => {
  try {
    await dotaLobbyModel
      .updateMany(
        {
          _id: {
            $in: lobby,
          },
          state: { $ne: CONSTANTS.DELETED },
        },
        {
          setMatchPlayerDetails: true,
        }
      )
      .exec();
    logger.debug(`DB updateManyLobby  `);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.findAllLobbies = async (lobby) => {
  try {
    const result = await dotaLobbyModel
      .find({
        _id: {
          $in: lobby,
        },
        state: { $ne: CONSTANTS.DELETED },
      })
      .lean(true)
      .exec();
    logger.debug(`DB findAllLobbies  --> ${util.inspect(result)}`);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

//**********************************************************LOBBYPLAYER MODEL***************************************************************************************************************************** */
//**********************************************************LOBBYPLAYER MODEL***************************************************************************************************************************** */
//**********************************************************LOBBYPLAYER MODEL***************************************************************************************************************************** */

module.exports.findOrCreateLobbyPlayer = async (lobbyPlayer) => {
  try {
    logger.debug(
      `Db findOrCreateLobbyPlayer lobbyPlayer ${util.inspect(lobbyPlayer)}`
    );
    let result = await dotaLobbyPlayerModel
      .findOneAndUpdate(
        {
          lobbyId: lobbyPlayer.lobbyId,
          steamId64: lobbyPlayer.steamId64,
        },
        lobbyPlayer,
        { new: true }
      )
      .lean(true)
      .exec();

    if (result) {
      return result;
    }

    result = await dotaLobbyPlayerModel.create(lobbyPlayer);

    return result._doc;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.getLobbyPlayerMatchStats = async (steamId64) => {
  try {
    let result = await dotaLobbyPlayerModel
      .find({
        steamId64,
      })
      .lean(true)
      .exec();
    logger.debug(`DB getLobbyPlayerMatchStats  --> ${util.inspect(result)}`);

    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.getPendingLobbyPlayerMatchStats = async (steamId64) => {
  try {
    let result = await dotaLobbyPlayerModel
      .find({
        steamId64,
        kills: -1,
      })
      .lean(true)
      .exec();
    logger.debug(
      `DB getPendingLobbyPlayerMatchStats  --> ${util.inspect(result)}`
    );

    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.getLobbyMatchStats = async (lobbyId) => {
  try {
    let result = await dotaLobbyPlayerModel
      .find({
        lobbyId,
        kills: { $ne: -1 },
      })
      .lean(true)
      .exec();
    logger.debug(
      `DB getPendingLobbyPlayerMatchStats  --> ${util.inspect(result)}`
    );

    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

//**********************************************************DOTAMATCH MODEL***************************************************************************************************************************** */
//**********************************************************DOTAMATCH MODEL***************************************************************************************************************************** */
//**********************************************************DOTAMATCH MODEL***************************************************************************************************************************** */

module.exports.findMatchdata = async (matchId) => {
  try {
    let result = await dotaMatchModel
      .findOne({
        matchId,
      })
      .select("odotaData")
      .lean(true)
      .exec();
    logger.debug(`DB findMatchdata  --> ${util.inspect(result)}`);

    if (result) {
      return result.odotaData;
    }

    // result = await dotaMatchModel.create(lobbyPlayer);

    return null;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};

module.exports.CreateMatchData = async (matchId, odotaData) => {
  try {
    let result = await dotaMatchModel.create({ matchId, odotaData });

    return result._doc.odotaData;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};


module.exports.getDefaults = async () => {
  try {
    const result = await dotaDefaultsModel
      .findOne({})
      .lean(true)
      .exec();
    logger.debug(`DB getDefaults   --> ${util.inspect(result)}`);
    return result;
  } catch (err) {
    logger.error(err);
    throw err.message;
  }
};