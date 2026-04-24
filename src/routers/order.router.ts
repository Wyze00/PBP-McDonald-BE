import type { Request, Response, Router } from "express";
import express from 'express';
import { authMiddleware } from "src/middlewares/auth.middleware.js";
import { OrderService } from "src/services/order.service.js";

export class OrderRouter {
    private static router: Router

    static {
        this.router = express.Router(); 
        this.init();
        this.router.use(authMiddleware);
    }

    static init() {

        this.router.get('/', async (req: Request, res: Response) => {

            const status = req.query.status as string;

            try {
                let response;
                if (status === 'COMPLETED') {
                    response = await OrderService.fetchCompletedOrders();
                } else {
                    response = await OrderService.fetchReadyAndOngoingOrders();
                }

                return res.status(200).json({
                    data: response,
                });
            } catch (error: any) {
                return res.status(500).json({
                    message: 'Cant fetch orders',
                });
            }
        })

        this.router.put('/:orderId', async (req: Request, res: Response) => {
            const { orderId } = req.params;
            const { status } = req.body;
            
            try {
                let response;
                if (status === 'ONGOING') {
                    response = await OrderService.markOngoing(orderId as string);
                } else if (status === 'COMPLETED') {
                    response = await OrderService.markCompleted(orderId as string);
                } else {
                    return res.status(400).json({
                        message: 'Invalid',
                    });
                }
                return res.status(200).json({
                    data: response,
                });
            } catch (error: any) {
                return res.status(400).json({
                    message: 'Invalid',
                });
            }
        });
    }

    static getRouter () {
        return this.router;
    }
}
