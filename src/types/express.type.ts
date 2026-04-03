import type { Request } from "express";
import type { User } from "./auth.type.js"

export interface RequestWithUser extends Request {
    user?: User;
}