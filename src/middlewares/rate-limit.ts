import rateLimit from "express-rate-limit";
import { RateLimitException } from "../exceptions/rate-limit";
import { ErrorCode, ErrorMessage } from "../exceptions/root";
import { RATE_IMIT_WINDOW, RATE_LIMIT_MAX_REQUESTS } from "../secrets";

const rateLimitWindow = RATE_IMIT_WINDOW ? Number(RATE_IMIT_WINDOW) : 15 * 60 * 1000
const rateLimitMaxRequests = RATE_LIMIT_MAX_REQUESTS ? Number(RATE_LIMIT_MAX_REQUESTS) : 2
export const limiterMiddleware = rateLimit({
  windowMs: rateLimitWindow,
  max: rateLimitMaxRequests,
  handler: (req, res, next) => {
    throw new RateLimitException(
      ErrorMessage.RATE_LIMIT_EXCEEDED,
      ErrorCode.RATE_LIMIT_EXCEEDED
    );
  },
});
