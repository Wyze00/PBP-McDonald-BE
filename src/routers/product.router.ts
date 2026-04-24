import { Router, type Request, type Response } from "express";
import express from 'express';
import { adminRoleMiddleware } from "src/middlewares/adminRole.middleware.js";
import { authMiddleware } from "src/middlewares/auth.middleware.js";
import { ProductService } from "src/services/product.service.js";
import type { PostProductRequest, PutProductRequest } from "src/types/product.type.js";


export class ProductRouterWithMiddleware {
    private static router: Router
    static {
        this.router = express.Router();
        this.router.use(authMiddleware);
        this.router.use(adminRoleMiddleware);
        this.init();
    }

    static init() {
        this.router.post('/', async (req: Request, res: Response) => {
            const data = req.body as PostProductRequest

            const response = await ProductService.create(data)

            return res.status(200).json({
                data: response
            })
        })

        this.router.put('/:id', async (req: Request, res: Response) => {
            const { id } = req.params
            const data = req.body as PutProductRequest

            const response = await ProductService.update(data, id as string)

            return res.status(200).json({
                data: response
            })
        })

        this.router.delete('/:id', async (req: Request, res: Response) => {
            const { id } = req.params

            const response = await ProductService.delete(id as string)

            return res.status(200).json({
                success: true
            })
        })
    }

    static getRouter() {
        return this.router
    }

}