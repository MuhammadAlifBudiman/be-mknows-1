import { Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Container } from "typedi";

import { User } from "@interfaces/user.interface";
import { RequestWithUser } from "@interfaces/authentication/token.interface";

import { AccountService } from "@services/account.service";
import { apiResponse } from "@/utils/apiResponse";

export class AccountController {
  private account = Container.get(AccountService);

  public getMyProfile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number;
    const user: User = await this.account.getProfileByUserId(user_id);

    res.status(200).json(apiResponse(200, "OK", "Get Profile Success", user));
  });
}