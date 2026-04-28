import type { PostCategoryRequest, PutCategoryRequest } from "src/types/category.type.js";
import { prismaClient } from "src/utils/prisma.util.js";
import { ZodUtil } from "src/utils/zod.util.js";
import { CategoryValidation } from "src/validations/category.validation.js";

export class CategoryService {

    static async fetchAll() {
        const result = await prismaClient.productCategory.findMany();

        return result.map((category) => {
            return {
                id: category.id,
                name: category.name,
            }
        })
    }

    static async fetchAllIncludeProducts() {
        const result = await prismaClient.productCategory.findMany({
            include: {
                products: {
                    where: {
                        deletedAt: null
                    }
                },
            }
        })

        return result.map((category) => {
            return {
                id: category.id,
                name: category.name,
                startDate: category.startDate,
                endDate: category.endDate,
                startTime: category.startTime,
                endTime: category.endTime,
                products: category.products.map((product) => {
                    return {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        description: product.description,
                        categoryId: category.id,
                    }
                })
            }
        })
    }

    static async create(data: PostCategoryRequest) {
        const validatedData = ZodUtil.validate(data, CategoryValidation.CREATEREQUEST);

        const category = await prismaClient.productCategory.create({
            data: {
                name: validatedData.name,
                startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
                endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
                startTime: validatedData.startTime ? new Date(`1970-01-01T${validatedData.startTime}:00`) : null,
                endTime: validatedData.endTime ? new Date(`1970-01-01T${validatedData.endTime}:00`) : null,
            }
        })

        return category;
    }

    static async update(data: PutCategoryRequest, categoryId: string) {
        const validatedData = ZodUtil.validate(data, CategoryValidation.UPDATEREQUEST);

        const category = await prismaClient.productCategory.update({
            where: {
                id: categoryId,
            },
            data: {
                name: validatedData.name,
                startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
                endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
                startTime: validatedData.startTime ? new Date(`1970-01-01T${validatedData.startTime}:00`) : null,
                endTime: validatedData.endTime ? new Date(`1970-01-01T${validatedData.endTime}:00`) : null,
            }
        })

        return category;
    }

    static async delete(categoryId: string) {
        await prismaClient.productCategory.delete({
            where: {
                id: categoryId
            }
        })

        return true;
    }

}