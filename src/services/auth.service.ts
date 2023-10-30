import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Service } from "typedi";

import { SECRET_KEY } from "@config/index";
import { DB } from "@database";

import { User } from "@interfaces/user.interface";
import { UserSession } from "@interfaces/user-session.interface";
import { UserAgent } from "@interfaces/common/useragent.interface";

import { DataStoredInToken, TokenPayload } from "@interfaces/authentication/token.interface";

import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";

const createAccessToken = (user: User, userSession: UserSession): TokenPayload => {
  const dataStoredInToken: DataStoredInToken = { uid: user.uuid, sid: userSession.uuid };
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
    if (findUser) throw new HttpException(false, 409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await DB.Users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async login(userData: CreateUserDto, userAgent: UserAgent): Promise<{ cookie: string; accessToken: string }> {
    const findUser: User = await DB.Users.findOne({ attributes: ["pk", "uuid", "password"], where: { email: userData.email } });
    if (!findUser) throw new HttpException(false, 409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(false, 409, "Password not matching");

    const sessionData = await this.createSession({ 
      pk: findUser.pk, useragent: userAgent.source, ip_address: userAgent.ip_address
    });

    const TokenPayload = createAccessToken(findUser, sessionData);
    const { token } = TokenPayload;

    const cookie = createCookie(TokenPayload);
    return { cookie, accessToken: token };
  }

  public async logout(userData: User, userSessionId: string): Promise<boolean> {
    const findUser: User = await DB.Users.findOne({ where: { pk: userData.pk } });
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");

    const logout = await this.logoutSessionActive({ uid: findUser.uuid, sid: userSessionId });
    return logout;
  }

  public async checkSessionActive(data: { uid: string, sid: string }): Promise<UserSession> {
    const userSession = await DB.UsersSessions.findOne({ 
      where: { uuid: data.sid, status: "ACTIVE" },
      include: [{ model: DB.Users, as: "user" }]
    });

    return userSession || null;
  };

  public async logoutSessionActive(data: { uid: string, sid: string }): Promise<boolean> {
    const userSession = await DB.UsersSessions.findOne({ 
      where: { uuid: data.sid, status: "ACTIVE" },
      include: { model: DB.Users, as: "user" }
    });
  
    if (userSession) {
      userSession.status = "LOGOUT";
      await userSession.save();
      return true;
    } else {
      return true;
    }
  }

  public async createSession(data: { pk: number, useragent: string, ip_address: string }): Promise<UserSession> {
    const session = await DB.UsersSessions.create({
      user_id: data.pk,
      useragent: data.useragent,
      ip_address: data.ip_address,
      status: "ACTIVE"
    });

    return session;
  };
}