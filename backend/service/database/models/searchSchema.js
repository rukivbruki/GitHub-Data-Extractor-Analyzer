const mongoose = require("mongoose");
module.exports = new mongoose.Schema({
  parameters: {
    city: String,
    library: String,
    count: Number,
  },
  result: {
    totalRepos: Number,
    namesAmount: Number,
    errorsAmount: Number,
  },
});
