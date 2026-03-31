import { v4 } from 'uuid';

export class UuidUtil {

    static generate (): string {
        return v4();
    }
}