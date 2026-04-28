import type { PostCategoryRequest, PutCategoryRequest } from "src/types/category.type.js";
import z, { type ZodType } from "zod";

export class CategoryValidation {

    static CREATEREQUEST: ZodType<PostCategoryRequest> = z.object({
        name: z.string()
            .min(1, 'Minimal kategori 1 karakter')
            .max(255, 'Nama tidak boleh melebihi 255 karakter'),
        startDate: z.string().date('Format tanggal salah (YYYY-MM-DD)').nullable(),
        endDate: z.string().date('Format tanggal salah (YYYY-MM-DD)').nullable(),
        startTime: z.string()
            .nullable(),
        endTime: z.string()
            .nullable(),
    });

    static UPDATEREQUEST: ZodType<PutCategoryRequest> = z.object({
        name: z.string()
            .min(1, 'Minimal kategori 1 karakter')
            .max(255, 'Nama tidak boleh melebihi 255 karakter'),
        startDate: z.string().date().nullable().optional(),
        endDate: z.string().date().nullable().optional(),
        startTime: z.string().nullable().optional(),
        endTime: z.string().nullable().optional(),
    });
}