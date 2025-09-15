import { ErrorCode, ErrorMessage, HttpException } from "./root";

export class RateLimitException extends HttpException {
  constructor(message: ErrorMessage, errorCode: ErrorCode) {
    super(message, errorCode, 429, null);
  }
}
