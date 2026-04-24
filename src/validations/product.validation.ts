import type { PostProductRequest, PutProductRequest } from "src/types/product.type.js";
import z, { type ZodType } from "zod";

export class ProductValidation {
    static CREATEREQUEST: ZodType<PostProductRequest> = z.object({
        name: z.string().min(1, 'Minimal 1 Karakter').max(100, 'Maksimal 100 karakter'),
        description: z.string().min(1, 'Minimal 1 Karakter').max(255, 'Maksimal 255 karakter'),
        imageUrl: z.string().min(1, 'Minimal 1 Karakter').max(255, 'Maksimal 255 karakter'),
        price: z.coerce.number().min(0, "Value Tidak Boleh Negatif"),
        categoryId: z.string().min(1, 'Minimal 1 Karakter').max(100, 'Maksimal 100 karakter')
    })

    static PUTREQUEST: ZodType<PutProductRequest> = z.object({
        name: z.string().min(1, 'Minimal 1 Karakter').max(100, 'Maksimal 100 karakter'),
        description: z.string().min(1, 'Minimal 1 Karakter').max(255, 'Maksimal 255 karakter'),
        imageUrl: z.string().min(1, 'Minimal 1 Karakter').max(255, 'Maksimal 255 karakter'),
        price: z.number().min(0, "Value Tidak Boleh Negatif"),
        categoryId: z.string().min(1, 'Minimal 1 Karakter').max(100, 'Maksimal 100 karakter')
    })
}