import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { DB } from "@database";
import { SECRET_KEY } from "@config";
import { HttpException } from "@exceptions/HttpException";
import { DataStoredInToken, RequestWithUser } from "@interfaces/auth.interface";

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
      const { uid } = verify(Authorization, SECRET_KEY) as DataStoredInToken;
      const findUser = await DB.Users.findOne({ where: { uuid: uid}});

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(false, 401, "Wrong authentication token #1"));
      }
    } else {
      next(new HttpException(false, 404, "Authentication token missing"));
    }
  } catch (error) {
    next(new HttpException(false, 401, "Wrong authentication token #2"));
  }
};