import { BcryptUtil } from "./utils/bcrypt.util.js";
import { prismaClient } from "./utils/prisma.util.js";

async function dummyUser () {
    await prismaClient.user.createMany({
        data: [
            {
                username: 'admin',
                password: await BcryptUtil.hash('adminadmin'),
                role: 'ADMIN'
            },
            {
                username: 'kitchen',
                password: await BcryptUtil.hash('kitchenkitchen'),
                role: 'KITCHEN'
            }
        ]
    })
}

async function dummyProduct () {

    const makanan = await prismaClient.productCategory.create({
        data: {
            name: 'Makanan'            
        }
    })

    const minuman = await prismaClient.productCategory.create({
        data: {
            name: 'Minuman'            
        }
    })

    await prismaClient.product.createMany({
        data: [
            {
                name: 'Makanan A',
                description: 'Makanan A',
                imageUrl: 'url',
                price: 1000,
                product_category_id: makanan.id,
            },
            {
                name: 'Makanan B',
                description: 'Makanan B',
                imageUrl: 'url',
                price: 5000,
                product_category_id: makanan.id,
            }
        ]
    })

     await prismaClient.product.createMany({
        data: [
            {
                name: 'Minuman A',
                description: 'Minuman A',
                imageUrl: 'url',
                price: 1000,
                product_category_id: minuman.id,
            },
            {
                name: 'Minuman B',
                description: 'Minuman B',
                imageUrl: 'url',
                price: 5000,
                product_category_id: minuman.id,
            }
        ]
    })
}