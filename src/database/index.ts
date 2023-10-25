import Sequelize from "sequelize";
import { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from "@config";
import { logger } from "@utils/logger";

import UserModel from "@models/users.model";

const sequelize = new Sequelize.Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  dialect: "postgres",
  host: DB_HOST,
  port: Number(DB_PORT),
  timezone: "+07:00",
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    underscored: true,
    freezeTableName: true,
    
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  },
  pool: {
    min: 0,
    max: 5,
  },
  logQueryParameters: NODE_ENV === "development",
  logging: (query, time) => {
    // logger.info(time + "ms" + " " + query);
    return false;
  },
  benchmark: false,
});

sequelize.authenticate();

export const DB = {
  Users: UserModel(sequelize),
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};