import type { OperatingSystem } from "@common/OperatingSystem";

export const getOperatingSystemFromPlatform = (platform: string): OperatingSystem => {
    const operatingSystemMap: Record<"darwin" | "win32", OperatingSystem> = {
        darwin: "macOS",
        win32: "Windows",
    };

    const operatingSystem: OperatingSystem | undefined = operatingSystemMap[platform];

    if (!operatingSystem) {
        throw new Error(`Unexpected platform: ${platform}`);
    }

    return operatingSystem;
};
