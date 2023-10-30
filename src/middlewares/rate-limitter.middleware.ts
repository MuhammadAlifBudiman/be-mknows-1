import { type NextFunction, type Request, type Response } from "express"
import {
  rateLimit,
  type RateLimitRequestHandler,
} from "express-rate-limit"
import { RATE_DELAY, RATE_LIMIT } from "@config/index";
import { HttpExceptionTooManyRequests } from "@/exceptions/HttpException";

class Limitter {
  public expressRateLimit = (): RateLimitRequestHandler => {
    const delay = Number(RATE_DELAY) * 60 * 1000;

    return rateLimit({
      windowMs: delay, // 15 minutes
      max: Number(RATE_LIMIT),
      handler: () => {
        throw new HttpExceptionTooManyRequests(
          ["Too many requests from this IP, please try again after 3 minutes"],
        );
      },
    });
  };
}

export default Limitter;