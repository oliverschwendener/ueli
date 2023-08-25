import { OperatingSystem } from "@common/OperatingSystem";

export const useOperatingSystem = (platform: string) => {
    const operatingSystemMap: Record<"darwin" | "win32", OperatingSystem> = {
        darwin: "macOS",
        win32: "Windows",
    };

    const operatingSystem: OperatingSystem | undefined = operatingSystemMap[platform];

    if (!operatingSystem) {
        throw new Error(`Unsupported platform: ${platform}`);
    }

    return { operatingSystem };
};
