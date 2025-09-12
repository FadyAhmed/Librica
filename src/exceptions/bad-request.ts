import { ErrorCode, ErrorMessage, HttpException } from "./root";

export class BadRequestException extends HttpException {
    constructor(message: ErrorMessage, errorCode: ErrorCode) {
        super(message, errorCode, 400, null)
    }
}