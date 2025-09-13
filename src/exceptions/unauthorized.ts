import { ErrorCode, ErrorMessage, ErrorStatus, HttpException } from "./root";

export class UnauthorizedException extends HttpException {
    constructor(message: ErrorMessage, errorCode: ErrorCode, errors: any = null) {
        super(message, errorCode, ErrorStatus.Unauthorized, errors)
    }
}