import { OperatingSystem } from "@common/OperatingSystem";

export const useCurrentOperatingSystem = ({ platform }: { platform: string }): OperatingSystem => {
    const operatingSystemMap: Record<"darwin" | "win32", OperatingSystem> = {
        darwin: "macOS",
        win32: "Windows",
    };

    const currentOperatingSystem: OperatingSystem | undefined = operatingSystemMap[platform];

    if (!currentOperatingSystem) {
        throw new Error(`Unexpected platform: ${platform}`);
    }

    return currentOperatingSystem;
};
