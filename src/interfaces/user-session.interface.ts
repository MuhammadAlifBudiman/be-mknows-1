import { User } from "@interfaces/user.interface";

export interface UserSession {
  get(): any;
  
  pk: number;
  uuid: string;

  user_id: number;
  useragent: string;
  ip_address: string;
  status: string;

  user?: User;
}