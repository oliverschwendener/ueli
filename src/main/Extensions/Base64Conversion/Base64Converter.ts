import { Buffer } from "buffer";

export class Base64Converter {
    public static encode(payload: string): string {
        return Buffer.from(payload, "binary").toString("base64");
    }

    public static decode(payload: string): string {
        return Buffer.from(payload, "base64").toString("binary");
    }
}
