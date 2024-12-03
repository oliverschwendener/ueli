import { v4 as uuidv4, v6 as uuidv6, v7 as uuidv7, validate as uuidValidate } from "uuid";

export class UuidGenerator {
    public static generatev4(): string {
        return uuidv4();
    }

    public static generatev6(): string {
        return uuidv6();
    }

    public static generatev7(): string {
        return uuidv7();
    }

    public static format(uuid: string, uppercase: boolean, hyphens: boolean, braces: boolean, quotes: boolean): string {
        if (!uuidValidate(uuid)) {
            throw new Error("Invalid UUID");
        }

        let formattedUuid = uuid;
        if (uppercase) {
            formattedUuid = formattedUuid.toUpperCase();
        }
        if (!hyphens) {
            formattedUuid = formattedUuid.replace(/-/g, "");
        }
        if (braces) {
            formattedUuid = `{${formattedUuid}}`;
        }
        if (quotes) {
            formattedUuid = `"${formattedUuid}"`;
        }
        return formattedUuid;
    }
}
