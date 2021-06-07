const mongoose = require("mongoose");
const mongooseHistory = require("mongoose-history");
const Schema = mongoose.Schema;

const dotaBotAdminSchema = new Schema(
  {
    steamId64: String,
    accountName: {
      type: String,
    },

    personaName: {
      type: String,
    },

    status: {
      type: String,
      enum: ["INACTIVE", "ACTIVE", "START", "COMPLETED"],

      default: "ACTIVE",
    },

    steam_guard_code: String,

    password: String,

    leagueid:Number
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);


module.exports = mongoose.model("dotabotAdmin", dotaBotAdminSchema);
