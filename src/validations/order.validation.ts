import type { PostOrderRequest } from "src/types/order.type.js";
import z, { type ZodType } from "zod";

export class OrderValidation {
    static CREATEREQUEST: ZodType<PostOrderRequest> = z.object({
        products: z.array(z.object({
            product_id: z.string().min(1),
            quantity: z.number().min(1, 'minimum quantity is 1')
        })).min(1),
        paymentMethod: z.string().min(1)
    })
}