import { Sequelize } from "sequelize";
import { NODE_ENV } from "@config/index";
import { logger } from "@utils/logger";

import config from "@config/database";
const dbConfig = config[NODE_ENV] || config["development"];

import RoleModel from "@models/roles.model";
import UserModel from "@models/users.model";
import UserRoleModel from "@models/users_roles.model";
import UserSessionModel from "@models/users_sessions.model";
import FileModel from "@models/files.model";

const sequelize = new Sequelize(
  dbConfig.database as string,
  dbConfig.username as string,
  dbConfig.password,
  dbConfig
);

sequelize
  .authenticate()
  .then(() => logger.info(`=> Database Connected on ${NODE_ENV}`));

export const DB = {
  Roles: RoleModel(sequelize),
  Users: UserModel(sequelize),
  UsersRoles: UserRoleModel(sequelize),
  UsersSessions: UserSessionModel(sequelize),
  Files: FileModel(sequelize),

  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};