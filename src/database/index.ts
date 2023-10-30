import { Sequelize } from "sequelize";
import { NODE_ENV } from "@config/index";

import config from "@config/database";
const dbConfig = config[NODE_ENV] || config["development"];

import UserModel from "@models/users.model";
import UserSessionModel from "@models/users_sessions.model";

const sequelize = new Sequelize(
  dbConfig.database as string,
  dbConfig.username as string,
  dbConfig.password,
  dbConfig
);

sequelize.authenticate();

export const DB = {
  Users: UserModel(sequelize),
  UsersSessions: UserSessionModel(sequelize),
  
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};