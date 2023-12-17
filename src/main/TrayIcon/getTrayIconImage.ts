import type { NativeTheme } from "electron";
import { join } from "path";
import type { OperatingSystem } from "../OperatingSystem";

export const getTrayIconImage = (operatingSystem: OperatingSystem, nativeTheme: NativeTheme) => {
    if (operatingSystem === "Windows") {
        const fileName = nativeTheme.shouldUseDarkColors
            ? "ueli-icon-white-on-transparent.ico"
            : "ueli-icon-black-on-transparent.ico";

        return join(__dirname, "..", "assets", fileName);
    }

    if (operatingSystem === "macOS") {
        return join(__dirname, "..", "assets", "ueliTemplate.png");
    }

    return nativeTheme.shouldUseDarkColors
        ? join(__dirname, "..", "assets", "ueli-icon-white-on-transparent.png")
        : join(__dirname, "..", "assets", "ueli-icon-black-on-transparent.png");
};
