export class HttpException extends Error {
  public message: string;
  public errorCode: ErrorCode;
  public statusCode: number;
  public errors: any;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    errors: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = "E001",
  USER_ALREADY_EXISTS = "E002",
  INCORRECT_PASSWORD = "E003",
  VALIDATION_ERROR = "E004",
  Unauthorized = "E005",
  INTERNAL_SERVER_ERROR = "E999",
}

export enum ErrorMessage {
  USER_NOT_FOUND = "User Not Found",
  USER_ALREADY_EXISTS = "User Already Exists",
  INCORRECT_PASSWORD = "Incorrect Password",
  VALIDATION_ERROR = "Validation Error",
  INTERNAL_SERVER_ERROR = "Internal Server Error",
  Unauthorized = "Unauthorized",
}

export enum ErrorStatus {
  INTERNAL_SERVER_ERROR = 500,
  VALIDATION_ERROR = 400,
  NOT_FOUND = 404,
  Unauthorized = 404,
}
