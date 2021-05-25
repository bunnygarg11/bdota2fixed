// add new genre
const adminList = [
  {
    steamId64: "76561199139099147",
    accountName: "dynastyesports",
    personaName: "my*****Name",
    steam_guard_code: "3DW4R",
    password: "St3@mAccountToBu!dlovelyAPI69",
  },
];
const dotaBotAdminModel = require("../../models/dotaBotAdmin.model");
// const logger = require("../../util/log");

// const dbUrl = 'mongodb+srv://stc-dev-dynasty-4747:7A50ZCsEeKQkZqHL@cluster0.prdq0.mongodb.net/esport?retryWrites=true&w=majority';


module.exports=async function(){

  // const dbUrl = process.env.MONGO_URI;

  // if (!dbUrl) {
    // logger.info("DB connection string not valid");
  // } else {
    // mongoose.connect(dbUrl);
    // const db = mongoose.connection;

    // db.on("error", console.error.bind(console, "connection error:"));

    // db.once("open", async () => {
      try {
        // logger.info("Connection open");
        await dotaBotAdminModel.deleteMany({});
        await dotaBotAdminModel.insertMany(adminList);
        // await db.close();
        // logger.info("Connection close");
      } catch (error) {
        // logger.info("Connection close abruptly");
        // await db.close();
      }
    // });
  // }

}
