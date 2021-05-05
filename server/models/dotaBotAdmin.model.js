const mongoose = require("mongoose");
const mongooseHistory = require("mongoose-history");
const Schema = mongoose.Schema;

const dotaBotAdminSchema = new Schema(
  {
    steamId64: String,
    accountName: {
      //   allowNull: false,

      type: String,
    },

    personaName: {
      //   allowNull: false,
      type: String,
    },

    status: {
      //   allowNull: false,
      //   type: DataTypes.STRING,
      //   defaultValue: CONSTANTS.BOT_OFFLINE,
      type: String,
      default: "BOT_OFFLINE",
    },

    prevStatus: String,

    steam_guard_code:String,

    

    password: String,
    //************************ */
    // data: {
    //   type: Object,
    //   default: {},
    // },
    // players: {
    //   type: Array,
    //   default: [],
    // },

    // radiant_team: Object,
    // dire_team: Object,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// dotaBotAdminSchema.plugin(mongooseHistory);

module.exports = mongoose.model("dotabotAdmin", dotaBotAdminSchema);
