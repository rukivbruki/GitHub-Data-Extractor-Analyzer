const mongoose = require("mongoose");
const { ConnectionLink } = require("../../const");
const searchSchema = require("./models/searchSchema");
mongoose.connect(ConnectionLink, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

function saveSearch(answers, logs) {
  const searchModel = mongoose.model("Search", searchSchema);
  const search = {
    parameters: {
      city: answers.city,
      library: answers.lib,
      count: answers.count,
    },
    result: {
      totalRepos: logs.totalRepos,
      namesAmount: logs.names.length,
      errorsAmount: logs.errors.length,
    },
  };
  const searchModelInstance = new searchModel(search);
  searchModelInstance.save((err, search) => {
    if (err) return console.error(err);
    console.log("successfully saved: ", search);
  });
}

function getAllSearches() {
  const searchModel = mongoose.model("Search", searchSchema);
  searchModel.find(function (err, searches) {
    if (err) return console.error(err);
    console.log(searches);
  });
}

module.exports = {
  saveSearch,
  getAllSearches,
};
