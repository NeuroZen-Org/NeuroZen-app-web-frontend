export class ApiResponse {
  constructor(data, success = true, message = '') {
    this.data = data;
    this.success = success;
    this.message = message;
  }

  static success(data, message = '') {
    return new ApiResponse(data, true, message);
  }

  static error(message, data = null) {
    return new ApiResponse(data, false, message);
  }
}
