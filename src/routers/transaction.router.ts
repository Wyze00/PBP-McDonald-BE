import type { Request, Response, Router } from "express";
import express from 'express';
import { adminRoleMiddleware } from "src/middlewares/adminRole.middleware.js";
import { authMiddleware } from "src/middlewares/auth.middleware.js";
import { TransactionService } from "src/services/transaction.service.js";

export class TransactionRouterWithMiddleware {
    private static router: Router

    static {
        this.router = express.Router(); 
        this.router.use(authMiddleware);
        this.router.use(adminRoleMiddleware);
        this.init();
    }

    static init() {
        this.router.get('/', async (req: Request, res: Response) => {
            const { include } = req.query;
            let { date = new Date().toISOString().slice(0,10) } = req.query;
            date += 'T00:00:00.000Z';   
            let response;

            if (include === 'orders') {
                response = await TransactionService.fetchAllIncludeOrder(date as string);
            } else {
                response = await TransactionService.fetchAll(date as string);
            }

            return res.status(200).json({
                data: response,
            })
        })

        this.router.get('/:transactionId/orders/:orderId/details', async (req: Request, res: Response) => {
            const { transactionId, orderId } = req.params; 
            const { include = 'products' } = req.query;

            const response = await TransactionService.fetchOrderDetail(transactionId as string, orderId as string);

            return res.status(200).json({
                data: response,
            })
        })
    }

    static getRouter () {
        return this.router;
    }
}