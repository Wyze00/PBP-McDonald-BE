import type { Product } from "prisma/generated/browser.js";
import type { OrderStatus, PaymentMethod } from "prisma/generated/enums.js";
import type { PostOrderRequest } from "src/types/order.type.js";
import { prismaClient } from "src/utils/prisma.util.js";
import { ZodUtil } from "src/utils/zod.util.js";
import { OrderValidation } from "src/validations/order.validation.js";
import { id } from "zod/locales";

export class OrderService {
    static async fetchById(id: string) {
        const order = await prismaClient.order.findUnique({
            where: {
                id: id
            },
            include: {
                orderTransaction: true,
                orderedProductsDetails: {
                    include: {
                        product: true // Fetches the actual product data (name, price)
                    }
                }
            }
        });

        if (!order) {
            throw new Error("Order not found");
        }

        return order;
    }

    static async create(data: PostOrderRequest) {
        const validatedData = ZodUtil.validate(data, OrderValidation.CREATEREQUEST)

        const products: Product[] = await prismaClient.product.findMany({
            where: {
                id: {
                    in: validatedData.products.map((product) => {
                        return product.product_id
                    })
                }
            }
        })


        const totalPrice: number = products.reduce((a, c) => {
            const index = validatedData.products.findIndex((p) => {
                return p.product_id == c.id
            })
            return a + c.price * validatedData.products[index]!.quantity
        }, 0)

        let orderNumber = await prismaClient.order.count({
            where: {
                orderDate: new Date().toISOString().slice(0, 10) + "T00:00:00.000Z"
            }
        }) + 1;


        const result = await prismaClient.order.create({
            data: {
                orderNumber: orderNumber,
                status: "READY",
                orderedProductsDetails: {
                    createMany: {
                        data: validatedData.products
                    }
                },
                orderTransaction: {
                    create: {
                        paymentMehthod: validatedData.paymentMethod as PaymentMethod,
                        totalCost: totalPrice
                    }
                }

            }
        })

        return {
            id: result.id,
            orderNumber: result.orderNumber,
            status: result.status
        }
    }
}


