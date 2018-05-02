import { OperatingSystem } from "../operating-system";
import { OperatingSystemNotSupportedError } from "../errors/operatingsystem-not-supported-error";

export class OperatingSystemHelpers {
    public static getOperatingSystemFromString(platform: string): OperatingSystem {
        switch (platform) {
            case "win32": return OperatingSystem.Windows;
            case "darwin": return OperatingSystem.macOS;
        }

        throw new OperatingSystemNotSupportedError();
    }
}
