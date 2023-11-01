import { Service } from "typedi";
import { DB } from "@database";

import { User } from "@interfaces/user.interface";
import { UserSession } from "@interfaces/user-session.interface";

import { UserSessionModel } from "@models/users_sessions.model";

@Service()
export class AccountService {
  public async getProfileByUserId(user_id: number): Promise<User> {
    const user: User = await DB.Users.findOne({ where: { pk: user_id } });
    return user;
  }

  public async getSessionsHistoriesByUserId(user_id: number, session_id: string): Promise<UserSession[]> {
    const userSessions: UserSessionModel[] = await DB.UsersSessions.findAll({
      attributes: { exclude: ["pk", "user_id"] },
      where: { user_id }
    });

    const userSessionsParsed = userSessions.map(session => ({
      ...session.get(),
      is_current: session.uuid === session_id
    }));

    userSessionsParsed.sort((a, b) => (b.is_current ? 1 : 0) - (a.is_current ? 1 : 0));
    return userSessionsParsed;
  }
}