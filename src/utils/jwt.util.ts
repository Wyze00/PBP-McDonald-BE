import jwt from 'jsonwebtoken';
import 'dotenv/config'

export class JwtUtil {
    private static SECRET: string = process.env['JWTKEY'] || '';

    static {
        if (this.SECRET === '') {
            process.exit(0);
        } 
    }

    static async sign (data: string | object): Promise<string> {
        return jwt.sign(data, JwtUtil.SECRET);
    }

    static async verify (token: string): Promise<any> {
        return jwt.verify(token, JwtUtil.SECRET);
    }
}