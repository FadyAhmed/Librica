import { ErrorCode, ErrorMessage, ErrorStatus, HttpException } from "./root";

export class NotFoundException extends HttpException {
    constructor(message: ErrorMessage, errorCode: ErrorCode, errors: any = null) {
        super(message, errorCode, ErrorStatus.NOT_FOUND, errors)
    }
}