import type { User } from "prisma/generated/client.js";
import { BadRequestException } from "src/errors/badRequest.error.js";
import { NotFoundException } from "src/errors/notFound.error.js";
import type { LoginRequest, LoginResponse } from "src/types/auth.type.js";
import { BcryptUtil } from "src/utils/bcrypt.util.js";
import { JwtUtil } from "src/utils/jwt.util.js";
import { prismaClient } from "src/utils/prisma.util.js";
import { ZodUtil } from "src/utils/zod.util.js";
import { AuthValidation } from "src/validations/auth.validation.js";

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
}