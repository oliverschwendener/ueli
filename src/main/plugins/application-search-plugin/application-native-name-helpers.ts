import { join } from "path";
import { ueliTempFolder } from "../../../common/helpers/ueli-helpers";

export const applicationNativeNameCachePath = join(ueliTempFolder, "application-native-name.json");

export function hashApplicationPath(str: string): string {
    let i = str.length;
    let hash1 = 0x1505;
    let hash2 = 0xcde7;
    while (i--) {
        const char = str.charCodeAt(i);
        hash1 = (hash1 * 0x21) ^ char;
        hash2 = (hash2 * 0x21) ^ char;
    }
    return ((hash1 >>> 0) * 0x1000 + (hash2 >>> 0)).toString(36);
}
