import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Service } from "typedi";

import { SECRET_KEY } from "@config";
import { DB } from "@database";

import { User } from "@interfaces/users.interface";
import { UserSession } from "@interfaces/users_sessions.interface";

import { DataStoredInToken, TokenPayload } from "@interfaces/auth.interface";

import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";

const createAccessToken = (user: User, userSession: UserSession): TokenPayload => {
  const dataStoredInToken: DataStoredInToken = { sid: userSession.uuid, uid: user.uuid };
  const expiresIn: number = 60 * 60;

  return { expiresIn: expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};  

const createCookie = (TokenPayload: TokenPayload): string => {
  return `Authorization=${TokenPayload.token}; HttpOnly; Max-Age=${TokenPayload.expiresIn};`;
};

@Service()
export class AuthService {
  public async signup(userData: CreateUserDto): Promise<User> {
    const findUser: User = await DB.Users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await DB.Users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = await DB.Users.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password not matching");

    const TokenPayload = createAccessToken(findUser, null);
    const cookie = createCookie(TokenPayload);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await DB.Users.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}