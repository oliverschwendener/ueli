import { v4 as uuidv4, v6 as uuidv6, v7 as uuidv7 } from "uuid";
import type { TokenFunction } from "./TokenFunction";

export class UuidFunction implements TokenFunction {
    public name = "UUID";

    public evaluate(params: string[]): string {
        const formatString = params[0] || "D";
        const version = params[1] || "v4";

        let uuid: string;

        switch (version.toLowerCase()) {
            case "v6":
                uuid = uuidv6();
                break;
            case "v7":
                uuid = uuidv7();
                break;
            case "v4":
            default:
                uuid = uuidv4();
                break;
        }

        return this.applyFormat(uuid, formatString);
    }

    private applyFormat(uuid: string, formatString: string): string {
        const format = formatString.trim().toUpperCase();

        if (format.length !== 1) {
            throw new Error(
                `Invalid UUID format: '${formatString}'. Format must be a single character (N, D, B or P).`,
            );
        }

        const validFormats = ["N", "D", "B", "P"];

        if (!validFormats.includes(format)) {
            throw new Error(`Invalid UUID format character: '${format}'. Valid formats are: N, D, B, or P.`);
        }

        const uuidWithoutHyphens = uuid.replace(/-/g, "");
        const uuidWithHyphens = `${uuidWithoutHyphens.substring(0, 8)}-${uuidWithoutHyphens.substring(8, 12)}-${uuidWithoutHyphens.substring(12, 16)}-${uuidWithoutHyphens.substring(16, 20)}-${uuidWithoutHyphens.substring(20)}`;

        switch (format) {
            case "N":
                return uuidWithoutHyphens;
            case "D":
                return uuidWithHyphens;
            case "B":
                return `{${uuidWithHyphens}}`;
            case "P":
                return `(${uuidWithHyphens})`;
            default:
                return uuidWithHyphens;
        }
    }
}
