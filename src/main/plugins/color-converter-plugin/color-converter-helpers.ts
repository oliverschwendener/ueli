import color from "color";
import { replaceWhitespace } from "../../../common/helpers/string-helpers";

export function isValidColorCode(value: string): boolean {
    value = replaceWhitespace(value.trim(), "");
    try {
        color(value);
        return value.startsWith("#") || value.startsWith("rgb(") || value.startsWith("rgba(");
    } catch {
        return false;
    }
}

export function toHex(value: string, defaultColor: string): string {
    try {
        return color(value).hex();
    } catch {
        return defaultColor;
    }
}
