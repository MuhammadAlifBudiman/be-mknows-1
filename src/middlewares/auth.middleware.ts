import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { SECRET_KEY } from "@config/index";
import { HttpException } from "@exceptions/HttpException";

import { UserSession } from "@interfaces/user-session.interface";
import { DataStoredInToken, RequestWithUser } from "@interfaces/authentication/token.interface";
import { AuthService } from "@services/auth.service";

const getAuthorization = (req: Request) => {
  const coockie = req.cookies["Authorization"];
  if (coockie) return coockie;

  const header = req.header("Authorization");
  if (header) return header.split("Bearer ")[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);
    
    if (Authorization) {
      const { uid, sid } = verify(Authorization, SECRET_KEY) as DataStoredInToken;
      const userSession: UserSession = await new AuthService().checkSessionActive({ uid, sid });
      
      if (userSession?.user?.uuid === uid) {
        req.session_id = sid;
        req.user = userSession.user;
        next();
      } else {
        next(new HttpException(false, 401, "Invalid Token #34"));
      }
    } else {
      next(new HttpException(false, 401, "Invalid Token #37"));
    }
  } catch (error) {
    console.error(error);
    next(new HttpException(false, 401, "Invalid Token #41"));
  }
};