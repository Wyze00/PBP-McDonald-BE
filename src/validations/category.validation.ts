import type { PostCategoryRequest, PutCategoryRequest } from "src/types/category.type.js";
import z, { type ZodType } from "zod";

export class CategoryValidation {

    static CREATEREQUEST: ZodType<PostCategoryRequest> = z.object({
        name: z.string().min(1, 'Minimal kategori 1 karakter').max(255, 'Id Tidak boleh melebihi 255 karakter') 
    })

    static UPDATEREQUEST: ZodType<PutCategoryRequest> = z.object({
        name: z.string().min(1, 'Minimal kategori 1 karakter').max(255, 'Id Tidak boleh melebihi 255 karakter') 
    })
}