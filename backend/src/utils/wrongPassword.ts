import { HttpError } from "routing-controllers";

class wrongPassword extends HttpError {
    public operationName: string;
    public args: any[];
  
    constructor(operationName: string, args: any[] = []) {
      super(555);
      Object.setPrototypeOf(this, wrongPassword.prototype);
      this.operationName = operationName;
    }
  
    toJSON() {
      return {
        status: this.httpCode,
        failedOperation: this.operationName,
      };
    }
}
export default wrongPassword