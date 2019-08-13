import { OperatingSystem } from "../operating-system";

export function getCurrentOperatingSystem(platform: string): OperatingSystem {
    switch (platform) {
        case "win32": return OperatingSystem.Windows;
        case "darwin": return OperatingSystem.macOS;
        default: throw new Error(`Platform "${platform}" is not supported`);
    }
}

export function isWindows(platform: string): boolean {
    return getCurrentOperatingSystem(platform) === OperatingSystem.Windows;
}

export function isMacOs(platform: string): boolean {
    return getCurrentOperatingSystem(platform) === OperatingSystem.macOS;
}
