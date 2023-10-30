import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";

import { AccountController } from "@controllers/account.controller";
import { AuthMiddleware } from '@middlewares/auth.middleware';

export class AccountRoute implements Routes {
  public path = "account";
  public router = Router();
  public account = new AccountController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/v1/${this.path}/profile/me`, AuthMiddleware, this.account.getMyProfile);
    this.router.get(`/v1/${this.path}/sessions/me`, AuthMiddleware, this.account.getMySessionsHistories);
  }
}