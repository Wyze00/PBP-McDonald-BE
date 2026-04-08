import type { NextFunction, Response } from "express";
import { UnauthorizeException } from "src/errors/unauthorize.error.js";
import type { RequestWithUser } from "src/types/express.type.js";

export const adminRoleMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {

    if (req.user!.role !== 'ADMIN') {
        throw new UnauthorizeException('Role Bukan Admin');
    }
    
    next();
}