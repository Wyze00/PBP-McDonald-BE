import { prismaClient } from "src/utils/prisma.util.js";

export class TransactionService {

    static async fetchAll(date: string) {
        const data = await prismaClient.orderTransaction.findMany({
            where: {
                order: {
                    orderDate: date,
                }
            }
        });

        return data.map((transaction) => {
            return {
                id: transaction.id,
                paymentMethod: transaction.paymentMehthod,
                totalCost: transaction.totalCost,
                status: transaction.status,
            }
        })
    }

    static async fetchAllIncludeOrder(date:string) {

        const data = await prismaClient.orderTransaction.findMany({
            where: {
                order: {
                    orderDate: date,
                }
            },
            include: {
                order: true,
            }
        });

        return data.map((transaction) => {
            return {
                id: transaction.id,
                paymentMethod: transaction.paymentMehthod,
                totalCost: transaction.totalCost,
                status: transaction.status,
                order: {
                    id: transaction.order.id,
                    orderNumber: transaction.order.orderNumber,
                    status: transaction.order.status,
                }
            }
        })
    }
    
    static async fetchOrderDetail(transactionId: string, orderId: string) {

        const data = await prismaClient.orderProduct.findMany({
            where: {
                AND: [
                    {
                        order_id: orderId
                    },
                    {
                        order: {
                            orderTransaction: {
                                id: transactionId
                            }
                        }
                    }
                ]
            },
            include: {
                product: true,
            }
        })

        return data.map((odt) => {
            return {
                id: odt.id,
                quantity: odt.quantity,
                product: {
                    id: odt.product.id,
                    name: odt.product.name,
                    imageUrl: odt.product.imageUrl,
                    price: odt.product.price,
                    description: odt.product.description,
                }
            }
        })
    }
}