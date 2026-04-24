import { HttpException } from "./http.error.js";

export class UnauthorizeException extends HttpException {
    constructor(message: string){
        super(500, message);
    }
}