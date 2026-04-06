import type { Request, Response, Router } from "express";
import express from 'express';
import { ProductService } from "src/services/product.service.js";

export class ProductRouter {
    private static router: Router

    static {
        this.router = express.Router();
        this.init();
    }

    static init() {

        this.router.get('/products', async (req: Request, res: Response) => {
            const response = await ProductService.fetchAll()

            return res.status(200).json({
                data: response
            })

        })
    }

    static getRouter() {
        return this.router;
    }
}
