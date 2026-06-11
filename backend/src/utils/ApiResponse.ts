export class ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;

  constructor(statusCode: number, message: string = "Success", data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}
