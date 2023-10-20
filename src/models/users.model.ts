import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { User } from "@interfaces/users.interface";

export type UserCreationAttributes = Optional<User, "pk" | "uuid" | "email" | "password">;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  public pk: number;
  public uuid: string;
  public email: string;
  public password: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      pk: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        allowNull: true,
        type: DataTypes.STRING(52),
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(320),
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(512),
      },
    },
    {
      tableName: "users",
      timestamps: true,
      paranoid: true,
      sequelize,
    },
  );

  return UserModel;
}