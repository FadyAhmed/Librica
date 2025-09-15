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
  UNAUTHORIZED = "E005",
  NOT_AN_ADMIN = "E006",
  BOOK_NOT_FOUND = "E007",
  DUBLICATE_BORROW = "E008",
  BORROWER_NOT_FOUND = "E009",
  NO_OVERDUE_BORROWER = "E010",
  RATE_LIMIT_EXCEEDED = "E011",
  NOT_FOUND = "E012",
  INTERNAL_SERVER_ERROR = "E999",
}

export enum ErrorMessage {
  USER_NOT_FOUND = "User Not Found",
  USER_ALREADY_EXISTS = "User Already Exists",
  INCORRECT_PASSWORD = "Incorrect Password",
  VALIDATION_ERROR = "Validation Error",
  INTERNAL_SERVER_ERROR = "Internal Server Error",
  UNAUTHORIZED = "Unauthorized",
  NOT_AN_ADMIN = "Unauthorized! You're not an admin",
  BOOK_NOT_FOUND = "Book Not Found",
  BORROWER_NOT_FOUND = "Borrower Not Found",
  NO_OVERDUE_BORROWER = "Borrower Already Returned The Book",
  RATE_LIMIT_EXCEEDED = "Too Many Requests",
  DUBLICATE_BORROW = "You've Already Borrowed This Book",
  NOT_FOUND = "Not Found",
}

export enum ErrorStatus {
  INTERNAL_SERVER_ERROR = 500,
  VALIDATION_ERROR = 400,
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
}
