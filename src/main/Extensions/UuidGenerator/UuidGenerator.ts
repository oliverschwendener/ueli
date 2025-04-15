import type { UuidFormat } from "@common/Extensions/UuidGenerator";
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

    public static format(uuid: string, format: UuidFormat, validateStrictly: boolean): string {
        if (
            (validateStrictly === true && !this.validateUuidStrictly(uuid)) ||
            (validateStrictly === false && !this.validateUuid(uuid))
        ) {
            throw new Error("Invalid UUID");
        }

        let formattedUuid = uuid;

        if (format.uppercase) {
            formattedUuid = formattedUuid.toUpperCase();
        }

        if (!format.hyphens) {
            formattedUuid = formattedUuid.replace(/-/g, "");
        }

        if (format.braces) {
            formattedUuid = `{${formattedUuid}}`;
        }

        if (format.quotes) {
            formattedUuid = `"${formattedUuid}"`;
        }

        return formattedUuid;
    }

    public static reformat(uuid: string, format: UuidFormat): string {
        let formattedUuid = uuid.replace(/["{}-]/g, "");

        if (format.uppercase) {
            formattedUuid = formattedUuid.toUpperCase();
        } else {
            formattedUuid = formattedUuid.toLowerCase();
        }

        if (format.hyphens) {
            const tempUuid = formattedUuid.replace(/-/g, "");

            formattedUuid =
                tempUuid.substring(0, 8) +
                "-" +
                tempUuid.substring(8, 12) +
                "-" +
                tempUuid.substring(12, 16) +
                "-" +
                tempUuid.substring(16, 20) +
                "-" +
                tempUuid.substring(20);
        } else {
            formattedUuid = formattedUuid.replace(/-/g, "");
        }

        if (format.braces) {
            formattedUuid = `{${formattedUuid}}`;
        } else {
            formattedUuid = formattedUuid.replace(/[{}]/g, "");
        }

        if (format.quotes) {
            formattedUuid = `"${formattedUuid}"`;
        } else {
            formattedUuid = formattedUuid.replace(/"/g, "");
        }

        return formattedUuid;
    }

    public static validateUuidStrictly(uuid: string): boolean {
        return uuidValidate(uuid);
    }

    public static validateUuid(uuid: string): boolean {
        return /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi.test(uuid);
    }
}
