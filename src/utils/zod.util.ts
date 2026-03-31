import { ZodType } from 'zod';

export class ZodUtil {

    static validate<T> (data: T, schema: ZodType<T>): T {
        return schema.parse(data);
    }
}