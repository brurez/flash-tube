const result = require("dotenv").config();
if (result.error) {
  throw result.error;
}

console.log(result.parsed);

import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

import { sequelize } from "./config/sequelize";
import controllers from "./controllers";
import models from "./models";

(async () => {
  try {
    await sequelize.addModels(models);
    await sequelize.sync();
  } catch (e) {
    console.log(e);
  }

  const app = express();
  const port = process.env.PORT || 5000; // default port to listen

  app.use(bodyParser.json());
  app.use(morgan("combined"));
  app.use(cors());

  app.use("/", controllers);

  // Root URI call
  app.get("/", async (req, res) => {
    res.send("Server up and running");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
