import type { Request, Response, Router } from "express";
import express from 'express';
import { adminRoleMiddleware } from "src/middlewares/adminRole.middleware.js";
import { authMiddleware } from "src/middlewares/auth.middleware.js";
import { CategoryService } from "src/services/category.service.js";
import type { PostCategoryRequest, PutCategoryRequest } from "src/types/category.type.js";

export class CategoryRouter {
    private static router: Router

    static {
        this.router = express.Router(); 
        this.init();
    }

    static init() {

        this.router.get('/', async (req: Request, res: Response) => {

            const { include } = req.query;

            let response;

            if (include === 'products') {
                response = await CategoryService.fetchAllIncludeProducts();
            } else {
                response = await CategoryService.fetchAll();
            }

            return res.status(200).json({
                data: response,
            })            
        })
    }

    static getRouter () {
        return this.router;
    }
}

export class CategoryRouterWithMiddleware {
    private static router: Router

    static {
        this.router = express.Router(); 
        this.router.use(authMiddleware);
        this.router.use(adminRoleMiddleware);
        this.init();
    }

    static init() {

        this.router.post('/', async (req: Request, res: Response) => {

            const data = req.body as PostCategoryRequest;

            const response = await CategoryService.create(data);

            return res.status(200).json({
                data: response,
            })
        })

        this.router.put('/:categoryId', async (req: Request, res: Response) => {
            const data = req.body as PutCategoryRequest;
            const { categoryId } = req.params;

            const response = await CategoryService.update(data, categoryId as string);

            return res.status(200).json({
                data: response,
            })
        })

        this.router.delete('/:categoryId', async (req: Request, res: Response) => {
            const { categoryId } = req.params;

            const response = await CategoryService.delete(categoryId as string);

            return res.status(200).json({
                data: response
            })

        })
    }

    static getRouter () {
        return this.router;
    }
}