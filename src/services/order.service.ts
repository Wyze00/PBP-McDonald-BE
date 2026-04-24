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
}