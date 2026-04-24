import type { LoginRequest, PostResetPasswordRequest, PostResetPasswordVerifyRequest } from "src/types/auth.type.js";
import z, {type  ZodType } from "zod";

export class AuthValidation {

    static LOGINREQUEST: ZodType<LoginRequest> = z.object({
        username: z.string().min(5, 'Username minimal 5 karakter').max(20, 'Username maximal 20 karakter'),
        password: z.string().min(8, 'Password minimal 8 karakter').max(20, 'Password maximal 20 karakter')
    })

    static RESETPASSWORDREQUEST: ZodType<PostResetPasswordRequest> = z.object({
        email: z.string().email('Bukan Email Valid')
    })

    static RESETPASSWORDVERIFYREQUEST: ZodType<PostResetPasswordVerifyRequest> = z.object({
        token: z.string().min(1, 'Token tidak boleh kosong'),
        password: z.string().min(8, 'Password minimal 8 karakter').max(20, 'Password maximal 20 karakter')
    })
}