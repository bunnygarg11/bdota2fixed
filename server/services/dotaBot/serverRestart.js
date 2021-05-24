

module.exports.onRestart = async (Db) => {
    await Db.setAllBotsOffline();
};