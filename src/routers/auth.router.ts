import type { Request, Response, Router } from "express";
import express from 'express';
import { authMiddleware } from "src/middlewares/auth.middleware.js";
import { AuthService } from "src/services/auth.service.js";
import type { LoginRequest } from "src/types/auth.type.js";
import type { RequestWithUser } from "src/types/express.type.js";

export class AuthRouter {
    private static router: Router

    static {
        this.router = express.Router(); 
        this.init();
    }

    static init() {

        this.router.post('/login', async (req: Request, res: Response) => {

            const data = req.body as LoginRequest;

            const response = await AuthService.login(data);

            res.cookie('token', response.token, {
                path: '/',
                httpOnly: true,
                signed: true,
            })

            return res.status(200).json({
                data: {
                    username: response.username,
                    role: response.role,
                }
            })
        })
    }

    static getRouter () {
        return this.router;
    }
}

export class AuthRouterWithMiddleware {
    private static router: Router

    static {
        this.router = express.Router(); 
        this.router.use(authMiddleware);
        this.init();
    }

    static init() {

        this.router.get('/status', async (req: RequestWithUser, res: Response) => {
            return res.status(200).json({
                data: req.user,
            });
        })

        this.router.delete('/logout', async (req: RequestWithUser, res: Response) => {
            return res.status(200).json({
                success: 'ok',
            });
        })
    }

    static getRouter () {
        return this.router;
    }
}