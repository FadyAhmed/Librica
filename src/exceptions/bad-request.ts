import { ErrorCode, ErrorMessage, HttpException } from "./root";

export class BadRequestException extends HttpException {
    constructor(message: ErrorMessage, errorCode: ErrorCode, errors: any = null) {
        super(message, errorCode, 400, errors)
    }
}