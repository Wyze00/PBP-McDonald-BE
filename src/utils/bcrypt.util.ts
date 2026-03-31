import bcrypt from 'bcrypt'

bcrypt.hash

bcrypt.compare

export class BcryptUtil {
    private static SECRET: string = process.env['BCRYPTKEY'] || '';

    static {
        if (this.SECRET === '') {
            process.exit(0);
        } 
    }

    static async hash (data: any): Promise<string> {
        return bcrypt.hash(data, this.SECRET);
    }

    static async compare (data: any, hash: string): Promise<boolean> {
        return bcrypt.compare(data, hash);
    }
}