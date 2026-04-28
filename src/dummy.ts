import { BcryptUtil } from "./utils/bcrypt.util.js";
import { prismaClient } from "./utils/prisma.util.js";

async function dummyUser () {
    await prismaClient.user.createMany({
        data: [
            {
                username: 'admin',
                password: await BcryptUtil.hash('adminadmin'),
                role: 'ADMIN',
                email: 'garfield38@ethereal.email'
            },
            {
                username: 'kitchen',
                password: await BcryptUtil.hash('kitchenkitchen'),
                role: 'KITCHEN',
                email: 'garfield389@ethereal.email'
            }
        ]
    })
}

async function dummyCategory() {
    await prismaClient.productCategory.create({
        data: {
            id: 'makanan',
            name: 'Makanan',
            startTime: new Date("1970-01-01T10:00:00"),
            endTime: new Date("1970-01-01T23:00:00"),         
        }
    })

    await prismaClient.productCategory.create({
        data: {
            id: 'minuman',
            name: 'Minuman',
            startDate: new Date('2026-04-01'),
            endDate: new Date('2026-04-30'),
        }
    })
}

async function dummyProduct () {
    await prismaClient.product.createMany({
        data: [
            {
                id: 'produk1',
                name: 'Makanan A',
                description: 'Makanan A',
                imageUrl: 'https://d2vuyvo9qdtgo9.cloudfront.net/foods/July2024/Od0aM1u2WwlUFkMz4s5H.png',
                price: 1000,
                product_category_id: 'makanan',
            },
            {
                id: 'produk2',
                name: 'Makanan B',
                description: 'Makanan B',
                imageUrl: 'https://d2vuyvo9qdtgo9.cloudfront.net/foods/November2023/4el9aA1delRrNDQJmkfu.webp',
                price: 5000,
                product_category_id: 'makanan',
            }
        ]
    })

     await prismaClient.product.createMany({
        data: [
            {
                id: 'produk3',
                name: 'Minuman A',
                description: 'Minuman A',
                imageUrl: 'https://d2vuyvo9qdtgo9.cloudfront.net/foods/November2024/4lHeMcIbcd1jktvLnDNc.png',
                price: 1000,
                product_category_id: 'minuman',
            },
            {
                id: 'produk4',
                name: 'Minuman B',
                description: 'Minuman B',
                imageUrl: 'https://d2vuyvo9qdtgo9.cloudfront.net/foods/November2024/zpgsirdZCvIkNn5Lm44k.png',
                price: 5000,
                product_category_id: 'minuman',
            }
        ]
    })
}

async function dummyOrder () {
    await prismaClient.order.create({
        data: {
            id: 'order1',
            orderNumber: 1,
            status: 'COMPLETED',
            orderedProductsDetails: {
                create: [
                    {
                        product_id: 'produk1',
                        quantity: 2,
                    }
                ]
            }
        }
    })

    await prismaClient.order.create({
        data: {
            id: 'order2',
            orderNumber: 2,
            status: 'COMPLETED',
            orderedProductsDetails: {
                create: [
                    {
                        product_id: 'produk1',
                        quantity: 1,
                    },
                    {
                        product_id: 'produk4',
                        quantity: 2,
                    }
                ]
            }
        }
    })

     await prismaClient.order.create({
        data: {
            id: 'order3',
            orderNumber: 3,
            status: 'ONGOING',
            orderedProductsDetails: {
                create: [
                    {
                        product_id: 'produk2',
                        quantity: 4,
                    }
                ]
            }
        }
    })

    await prismaClient.order.create({
        data: {
            id: 'order4',
            orderNumber: 4,
            status: 'READY',
            orderedProductsDetails: {
                create: [
                    {
                        product_id: 'produk2',
                        quantity: 3,
                    },
                    {
                        product_id: 'produk3',
                        quantity: 2,
                    }
                ]
            }
        }
    })
}

async function dummyTransaction () {
    await prismaClient.orderTransaction.create({
        data: {
            id: 'transaction1',
            paymentMehthod: 'CARD',
            totalCost: 5000,
            order_id: 'order1',
            status: 'SUCCESS'
        }
    })

    await prismaClient.orderTransaction.create({
        data: {
            id: 'transaction2',
            paymentMehthod: 'QRIS',
            totalCost: 10000,
            order_id: 'order2',
            status: 'SUCCESS'
        }
    })

     await prismaClient.orderTransaction.create({
        data: {
            id: 'transaction3',
            paymentMehthod: 'CASH',
            totalCost: 15000,
            order_id: 'order3',
            status: 'SUCCESS'
        }
    })

    await prismaClient.orderTransaction.create({
        data: {
            id: 'transaction4',
            paymentMehthod: 'QRIS',
            totalCost: 7239,
            order_id: 'order4',
            status: 'SUCCESS'
        }
    })
}

async function init() {
    await dummyCategory();
    await dummyProduct();
    await dummyOrder();
    await dummyTransaction();
}

init();