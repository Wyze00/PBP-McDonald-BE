import { NotFoundException } from "src/errors/notFound.error.js";
import type { PostProductRequest, PutProductRequest } from "src/types/product.type.js";
import { prismaClient } from "src/utils/prisma.util.js";
import { ZodUtil } from "src/utils/zod.util.js";
import { ProductValidation } from "src/validations/product.validation.js";
import { _isoDate, _isoDateTime } from "zod/v4/core";


export class ProductService {

    static async create(data: PostProductRequest) {
        const validatedData = ZodUtil.validate(data, ProductValidation.CREATEREQUEST)
        const validCategory = await prismaClient.productCategory.findUnique({
            where: { id: validatedData.categoryId }
        })

        if (validCategory === null) {
            throw new NotFoundException("Category Not Found");
        }

        const product = await prismaClient.product.create({
            data: {
                name: validatedData.name,
                description: validatedData.description,
                imageUrl: validatedData.imageUrl,
                price: validatedData.price,
                product_category_id: validatedData.categoryId
            }
        })

        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.product_category_id,
            imageUrl: product.imageUrl
        }
    }

    static async update(data: PutProductRequest, id: string) {
        const validatedData = ZodUtil.validate(data, ProductValidation.PUTREQUEST);

        const validCategory = await prismaClient.productCategory.findUnique({
            where: { id: validatedData.categoryId }
        })

        if (validCategory === null) {
            throw new NotFoundException("Category Not Found");
        }

        const product = await prismaClient.product.update({
            where: {
                id: id
            },
            data: {
                name: validatedData.name,
                description: validatedData.description,
                imageUrl: validatedData.imageUrl,
                price: validatedData.price,
                product_category_id: validatedData.categoryId
            }
        })

        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.product_category_id,
            imageUrl: product.imageUrl
        }
    }

    static async delete(id: string) {
        const now = new Date().toISOString()
        await prismaClient.product.update({
            where: {
                id: id
            },
            data: {
                deletedAt: now,
            }
        })

        return true
    }

   
}