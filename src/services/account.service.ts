import { Service } from "typedi";
import { DB } from "@database";

import { User } from "@interfaces/user.interface";

@Service()
export class AccountService {
  public async getProfileByUserId(user_id: number): Promise<User> {
    const user: User = await DB.Users.findOne({ where: { pk: user_id } });
    return user;
  }
}