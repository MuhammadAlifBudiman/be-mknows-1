import { Request } from "express";
import { User } from "@interfaces/user.interface";

export interface DataStoredInToken {
  sid?: string;
  uid: string;
  iat?: number;
  exp?: number;
}

export interface TokenPayload {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  session_id: string;
  user: User;
}