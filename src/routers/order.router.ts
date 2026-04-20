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

        this.router.get('/:id', async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                const response = await OrderService.fetchById(id as string);

                return res.status(200).json({
                    data: response
                });
            } catch (error) {
                return res.status(404).json({
                    error: "Order not found"
                });
            }
        });
    }

    static getRouter() {
        return this.router;
    }
}



