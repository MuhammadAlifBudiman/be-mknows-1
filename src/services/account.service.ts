import { Service } from "typedi";
import { DB } from "@database";

import { User } from "@interfaces/user.interface";
import { UserSession } from "@interfaces/user-session.interface";

@Service()
export class AccountService {
  public async getProfileByUserId(user_id: number): Promise<User> {
    const user: User = await DB.Users.findOne({ where: { pk: user_id } });
    return user;
  }

  public async getSessionsHistoriesByUserId(user_id: number, session_id: string): Promise<UserSession[]> {
    const userSessions: UserSession[] = await DB.UsersSessions.findAll({ 
      attributes: { exclude: ["pk", "user_id"] },
      where: { user_id } 
    });

    const userSessionsParsed = userSessions.map(session => {
      if(session.uuid === session_id) return {
        ...session.get(),
        is_current: true
      };
      
      return {
        ...session.get(),
        is_current: false
      }
    });

    return userSessionsParsed;
  }
}