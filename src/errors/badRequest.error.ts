import { HttpException } from "./http.error.js";

export class BadRequestException extends HttpException {
    constructor(message: string){
        super(400, message);
    }
}