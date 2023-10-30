import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { SECRET_KEY } from "@config/index";
import { HttpException } from "@exceptions/HttpException";

import { UserSession } from "@interfaces/user-session.interface";
import { UserAgent } from "@interfaces/common/useragent.interface";
import { DataStoredInToken, RequestWithUser } from "@interfaces/authentication/token.interface";

import { AuthService } from "@services/auth.service";
import { getUserAgent } from "@utils/userAgent";

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
    const userAgentPayload: UserAgent = getUserAgent(req);

    if (Authorization) {
      const { uid, sid } = verify(Authorization, SECRET_KEY) as DataStoredInToken;
      const userSession: UserSession = await new AuthService().checkSessionActive({ sid });
      
      console.log("SESSION ID ", sid);
      if (userSession?.user?.uuid === uid) {
        if(userAgentPayload.source === userSession.useragent) {
          req.session_id = sid;
          req.user = userSession.user;
          
          next();
        } else {
          next(new HttpException(false, 401, "Invalid Token #39"));
        }
      } else {
        next(new HttpException(false, 401, "Invalid Token #42"));
      }
    } else {
      next(new HttpException(false, 401, "Invalid Token #45"));
    }
  } catch (error) {
    console.error(error);
    next(new HttpException(false, 401, "Invalid Token #49"));
  }
};