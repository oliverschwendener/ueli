import type { OperatingSystem } from "./Contract";

export const getOperatingSystemFromPlatform = (platform: string): OperatingSystem => {
    const operatingSystemMap: Record<"darwin" | "win32" | "linux", OperatingSystem> = {
        darwin: "macOS",
        win32: "Windows",
        linux: "Linux",
    };

    const operatingSystem = operatingSystemMap[platform];

    if (!operatingSystem) {
        throw new Error(`Unexpected platform: ${platform}`);
    }

    return operatingSystem;
};
