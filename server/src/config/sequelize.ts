import { Sequelize } from "sequelize-typescript";
import { config } from "./config";

const c = config.db;

export const sequelize = new Sequelize(c.name, c.username, c.password, {
  host: c.host,
  dialect: "postgres",
  storage: ":memory:",
});
