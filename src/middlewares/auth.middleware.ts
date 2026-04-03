import type { NextFunction, Response } from "express";
import { UnauthorizeException } from "src/errors/unauthorize.error.js";
import type { User } from "src/types/auth.type.js";
import type { RequestWithUser } from "src/types/express.type.js";
import { JwtUtil } from "src/utils/jwt.util.js";

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {

    const token: string | undefined = req.signedCookies['token'];

    if (token === undefined) {
        throw new UnauthorizeException('Unauthorize');
    }

    const user = await JwtUtil.verify(token) as User;

    req.user = user;
    next();
}