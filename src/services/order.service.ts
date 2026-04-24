import { prismaClient } from "src/utils/prisma.util.js";
import { OrderStatus } from "prisma/generated/enums.js";

export class OrderService {
    static async fetchReadyAndOngoingOrders() {
        const data = await prismaClient.order.findMany({
            where: {
                status: {
                    in: ["READY", "ONGOING",]
                }
            },
            include: {
                orderedProductsDetails: {
                    include: {
                        product: true,
                    }
                }
            },
            orderBy: {
                orderTimestamp: "asc",
            }
        });
        return data.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            items: order.orderedProductsDetails.map((odt) => ({
                productName: odt.product.name,
                quantity: odt.quantity,
            }))
        }));
    }
    static async markOngoing(orderId: string) {
        return await prismaClient.order.update({
           where: { id: orderId},
           data: { status: OrderStatus.ONGOING },
        });
    }

    static async fetchCompletedOrders() {
        const data = await prismaClient.order.findMany({
            where: {
                status: OrderStatus.COMPLETED,
            },
            include: {
                orderedProductsDetails: {
                    include: {
                        product: true,
                    }
                }
            },
            orderBy: {
                orderTimestamp: "asc",
            }
        });
        return data.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            items: order.orderedProductsDetails.map((odt) => ({
                productName: odt.product.name,
                quantity: odt.quantity,
            }))
        }));
    }

    static async markCompleted(orderId: string) {
        return await prismaClient.order.update({
           where: { id: orderId},
           data: { status: OrderStatus.COMPLETED },
        });
    }

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


