import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import asyncHandler from "express-async-handler";

import { CreateUserDto } from "@dtos/users.dto";
import { User } from "@interfaces/users.interface";
import { RequestWithUser } from "@interfaces/auth.interface";
import { AuthService } from "@services/auth.service";

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;
    const signUpUserData: User = await this.auth.signup(userData);

    res.status(201).json({ data: signUpUserData, message: "signup" });
  });

  public logIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, findUser, accessToken } = await this.auth.login(userData);

      res.setHeader("Set-Cookie", [cookie]);
      res.status(200).json({ data: findUser, message: "Login success", accessToken });
    } catch (error) {
      next(error);
    }
  });

  public logOut = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.auth.logout(userData);

      res.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
      res.status(200).json({ data: logOutUserData, message: "logout" });
    } catch (error) {
      next(error);
    }
  });
}