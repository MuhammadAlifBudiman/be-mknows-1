export class HttpException extends Error {
  public success: boolean;
  public status: number;
  public message: string;
  public errors?: string[];

  constructor(success: boolean, status: number, message: string, errors: string[]) {
    super(message);

    this.success = success;
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}