import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { User } from "@interfaces/user.interface";

export type UserCreationAttributes = Optional<User, "pk" | "uuid" | "full_name" | "display_picture">;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  public pk: number;
  public uuid: string;
  
  public full_name?: string;
  public display_picture?: number;
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
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.STRING(52),
      },
      full_name: {
        allowNull: true,
        type: DataTypes.STRING(52),
      },
      display_picture: {
        allowNull: true,
        type: DataTypes.INTEGER(),
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
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    },
  );

  return UserModel;
}