import { Router, type Request, type Response } from "express";
import express from 'express';
import { adminRoleMiddleware } from "src/middlewares/adminRole.middleware.js";
import { authMiddleware } from "src/middlewares/auth.middleware.js";
import { OrderService } from "src/services/order.service.js";
import type { PostOrderRequest } from "src/types/order.type.js";

export class OrderRouter {
    private static router: Router

    static {
        this.router = express.Router()
        this.init()
    }

    static init() {
        this.router.post('/', async (req: Request, res: Response) => {
            const data = req.body as PostOrderRequest

            const response = await OrderService.create(data)

            return res.status(200).json({
                data: response
            })
        })
    }

    static getRouter() {
        return this.router;
    }
}



