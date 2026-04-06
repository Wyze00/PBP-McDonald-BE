import type { Product } from "prisma/generated/browser.js";
import { prismaClient } from "src/utils/prisma.util.js";

export class ProductService {
    static async fetchAll(): Promise<Product[]> {
        const products = await prismaClient.product.findMany();
        return products
    }
}