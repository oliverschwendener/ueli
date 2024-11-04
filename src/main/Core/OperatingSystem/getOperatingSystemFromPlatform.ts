import type { OperatingSystem } from "@common/Core";

export const getOperatingSystemFromPlatform = (platform: string): OperatingSystem => {
    const operatingSystemMap: Record<string, OperatingSystem> = {
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
