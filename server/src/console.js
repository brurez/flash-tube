const result = require("dotenv").config();

if (result.error) {
  throw result.error;
}
const { sequelize } = require("./config/sequelize");
const models = require("./models");

const repl = require("repl");

(async () => {
  await sequelize.addModels(models);
  await sequelize.sync();

  V0MODELS.forEach((model) => {
    global[model.name] = model;
  });

  const replServer = repl.start({
    prompt: "app > ",
  });
})();

//replServer.context.db = models;
