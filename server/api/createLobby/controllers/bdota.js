var Services = require("../../../services/network");
var dota = require("../../../services/dotaApi");

const _bdota = async (req, res, next) => {
  try {
    const { gamerId, type, personname, matchId, heroId, teamId } = req.query;

    var data;

    if (type == "searchBypersonname")
      data = await dota.searchBypersonname(personname);
    if (type == "getProfileByGamerId")
      data = await dota.getProfileByGamerId(gamerId);
    if (type == "getBymatchId") data = await dota.getBymatchId(matchId);
    if (type == "getPlayerMatches") data = await dota.getPlayerMatches(gamerId);
    if (type == "getHeroes") data = await dota.getHeroes(gamerId);
    if (type == "getLive") data = await dota.getLive();
    if (type == "getPlayerStats") data = await dota.getPlayerStats(gamerId);
    if (type == "getPlayerPeers") data = await dota.getPlayerPeers(gamerId);
    if (type == "proPlayersPlayedWith")
      data = await dota.getPlayerPeers(gamerId);
    if (type == "aggOnBasisOfCat") data = await dota.aggOnBasisOfCat(gamerId);
    if (type == "getPlayerRatings") data = await dota.getPlayerRatings(gamerId);
    if (type == "getPlayerHeroesRanking")
      data = await dota.getPlayerHeroesRanking(gamerId);
    if (type == "getAllTeams") data = await dota.getAllTeams();
    if (type == "getTeamDetails") data = await dota.getTeamDetails(teamId);
    if (type == "getTeamMatches") data = await dota.getTeamMatches(teamId);
    if (type == "getTeamPlayers") data = await dota.getTeamPlayers(teamId);
    if (type == "getTeamHeroes") data = await dota.getTeamHeroes(teamId);
    if (type == "getAllLeagues") data = await dota.getAllLeagues();
    if (type == "getConstants") data = await dota.getConstants();
    if (type == "getAllHeroes") data = await dota.getAllHeroes();
    if (type == "getHeroesMatchups")
      data = await dota.getHeroesMatchups(heroId);
    if (type == "getHeroesPlayers") data = await dota.getHeroesPlayers(heroId);

    res.send(data);

    // const dotaApiKeyavailable = false;

    //  let config = {
    //    method: "get",
    //    url: `https://api.opendota.com/api/players/${gamerId}`,
    //    // headers: {
    //    //   Accept: "application/json",
    //    //   "Content-Type": "application/json",
    //    //   Authorization: `Bearer ${dotaApiKey}`,
    //    // },
    //  };
    //  if (dotaApiKeyavailable) {
    //    config.headers = {
    //      Accept: "application/json",
    //      "Content-Type": "application/json",
    //      Authorization: `Bearer ${dotaApiKey}`,
    //    };
    //  }
    //   axios(config)
    //    .then((resp) => {
    //        res.send({ data: resp.data });

    // })
    //    .catch(function (error) {
    //      if (error.response) {
    //        // The request was made and the server responded with a status code
    //        // that falls out of the range of 2xx
    //        console.log(error.response.data);
    //        console.log(error.response.status);
    //        console.log(error.response.headers);
    //        res.send({error:error.response});
    //      } else if (error.request) {
    //        // The request was made but no response was received
    //        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //        // http.ClientRequest in node.js
    //        console.log(error.request);
    //        res.send({ error: error.request });

    //     //    return error.request;
    //      } else {
    //        // Something happened in setting up the request that triggered an Error
    //        console.log("Error", error.message);
    //        res.send({ error: error.message });

    //     //    return error.message;
    //      }
    //      //   console.log(error.config);
    //    });

    // let { doctorId, page = 1, numberOfItems = 50 } = req.body;
    // var offset = (page - 1) * numberOfItems;

    /**
     *  number of items user want in single page
     */

    // let data = await pool.query(
    //   `SELECT review.doctorId,review.reviewBody,review.rating,review.reviewerId,CONCAT(user.firstName," ",user.lastName) AS  reviewerName,DATE_FORMAT(review.created_at,'%d/%m/%Y')  AS rewiewDate  FROM review LEFT JOIN user ON user.userId=review.reviewerId WHERE ? && ? ORDER BY created_at DESC LIMIT ${offset},${numberOfItems} `,
    //   [{ doctorId }, { visibility: 1 }]
    // );

    // Services._response(res, data, "Reviews fetched successfully");
  } catch (error) {
    Services._handleError(res, error.message, error.message);
  }
};
module.exports = { _bdota };
