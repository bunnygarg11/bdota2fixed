let mongoose = require("mongoose");
const mongooseHistory = require("mongoose-history");

let Schema = mongoose.Schema;

let dotamatch = new Schema({
 

  

  

  matchId: String,

  

  valveData: Object,

  odotaData: Object,

  
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
});

// dotamatch.plugin(mongooseHistory);

module.exports = mongoose.model("dotamatch", dotamatch);
