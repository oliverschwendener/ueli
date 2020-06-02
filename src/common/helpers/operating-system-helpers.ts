import { OperatingSystem } from "../operating-system";

export function getCurrentOperatingSystem(platform: string): OperatingSystem {
    if (isWindows(platform)) {
        return OperatingSystem.Windows;
    }

    if (isMacOs(platform)) {
        return OperatingSystem.macOS;
    }

    throw new Error(`Platform "${platform}" is not supported`);
}

export function isWindows(platform: string): boolean {
    return platform === "win32";
}

export function isMacOs(platform: string): boolean {
    return platform === "darwin";
}
