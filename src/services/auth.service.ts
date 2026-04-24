import type { User } from "prisma/generated/client.js";
import { BadRequestException } from "src/errors/badRequest.error.js";
import { NotFoundException } from "src/errors/notFound.error.js";
import type { LoginRequest, LoginResponse, PostResetPasswordRequest, PostResetPasswordVerifyRequest } from "src/types/auth.type.js";
import { BcryptUtil } from "src/utils/bcrypt.util.js";
import { JwtUtil } from "src/utils/jwt.util.js";
import { mailer } from "src/utils/mailer.util.js";
import { prismaClient } from "src/utils/prisma.util.js";
import { ZodUtil } from "src/utils/zod.util.js";
import { AuthValidation } from "src/validations/auth.validation.js";
import crypto from 'crypto';

export class AuthService {

    static async login(data: LoginRequest): Promise<LoginResponse> {
        const validatedData = ZodUtil.validate<LoginRequest>(data, AuthValidation.LOGINREQUEST);

        const user: User | null = await prismaClient.user.findUnique({
            where: {
                username: validatedData.username,
            }
        })

        if (user == null) {
            throw new BadRequestException('Username atau Password salah');
        }

        const isPasswordValid = await BcryptUtil.compare(validatedData.password, user.password);

        if (isPasswordValid === false) {
            throw new BadRequestException('Username atau Password salah');
        }

        const token = await JwtUtil.sign({
            username: user.username,
            role: user.role,
        })

        return {
            username: user.username,
            role: user.role,
            token,
        }
    }

    static async resetPassword(data: PostResetPasswordRequest) {

        const validatedData = ZodUtil.validate<PostResetPasswordRequest>(data, AuthValidation.RESETPASSWORDREQUEST);

        const user = await prismaClient.user.findUnique({
            where: {
               email: validatedData.email,
            }
        })

        if (user === null) {
            throw new NotFoundException('User Tidak Ditemukan');
        }

        const token = crypto.randomBytes(32).toString('hex');
        // 15 Menit
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        const up = await prismaClient.user.update({
            where: {
                email: user.email,
            },
            data: {
                resetPasswordToken: token,
                resetPasswordExpires: expires,
            }
        })
        
        await mailer.sendMail({
            from: "Admin: admin@noreply.com",
            to: user.email,
            subject: 'Reset Password McDonald',
            text: `Link http://localhost:5173/reset-password/verify?token=${token}`
        })

        return true;
    }

    static async resetPasswordVerify(data: PostResetPasswordVerifyRequest) {

        const validatedData = ZodUtil.validate<PostResetPasswordVerifyRequest>(data, AuthValidation.RESETPASSWORDVERIFYREQUEST);

        const user = await prismaClient.user.findFirst({
            where: {
                resetPasswordToken: validatedData.token,
                resetPasswordExpires: {
                    gt: new Date(),
                }
            }
        })

        if (user === null) {
            throw new NotFoundException('Token Invalid atau Expired');
        }

        await prismaClient.user.update({
            where: {
                username: user.username
            },
            data: {
                password: await BcryptUtil.hash(validatedData.password),
            }
        })

        return true;
    }
}