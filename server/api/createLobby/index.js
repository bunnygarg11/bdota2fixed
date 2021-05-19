const express = require("express");
const router = express.Router();
const { _createsteamlobby } = require("./controllers/createLobby");
const { _bupdateQuery } = require("./controllers/query");
const { _bpractice } = require("./controllers/bpractice");
const { _clearLobby } = require("./controllers/clearLobby");
const {_getMatchStatsPlatform } = require("./controllers/getMatchStatsPlatform");
const {
  _getMatchStats,
} = require("./controllers/findMatchStats");
const {
  _bdota,
} = require("./controllers/bdota");


router.get("/createLobby", _createsteamlobby);
router.get("/bupdateQuery", _bupdateQuery);
router.get("/bpractice", _bpractice);
router.get("/clearLobby", _clearLobby);
router.get("/getMatchStatsPlatform", _getMatchStatsPlatform);
router.get("/getMatchStats", _getMatchStats);
router.get("/bdota", _bdota);

module.exports = router;
