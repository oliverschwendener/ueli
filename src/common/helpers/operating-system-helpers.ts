import { OperatingSystem, OperatingSystemVersion } from "../operating-system";

export function getCurrentOperatingSystem(platform: string): OperatingSystem {
    switch (platform) {
        case "win32":
            return OperatingSystem.Windows;
        case "darwin":
            return OperatingSystem.macOS;
        case "linux":
            return OperatingSystem.Linux;
        default:
            throw new Error(`Platform "${platform}" is not supported`);
    }
}

export function getOperatingSystemVersion(
    operatingSystem: OperatingSystem,
    operatingSystemRelease: string,
): OperatingSystemVersion {
    switch (operatingSystem) {
        case OperatingSystem.macOS:
            return getMacOsVersion(operatingSystemRelease);
        case OperatingSystem.Windows:
            return getWindowsVersion(operatingSystemRelease);
        case OperatingSystem.Linux:
            return getLinuxVersion();
    }
}

function getWindowsVersion(operatingSystemRelease: string): OperatingSystemVersion {
    if (operatingSystemRelease.startsWith("10.")) {
        return OperatingSystemVersion.Windows10;
    } else if (operatingSystemRelease.startsWith("6.3")) {
        return OperatingSystemVersion.Windows8_1;
    } else if (operatingSystemRelease.startsWith("6.2")) {
        return OperatingSystemVersion.Windows8;
    } else if (operatingSystemRelease.startsWith("6.1")) {
        return OperatingSystemVersion.Windows7;
    } else {
        throw new Error(`Unsupported Windows version: ${operatingSystemRelease}`);
    }
}

function getMacOsVersion(operatingSystemRelease: string): OperatingSystemVersion {
    const darwinKernelVersion = operatingSystemRelease.substr(0, 2);
    switch (darwinKernelVersion) {
        case "14":
            return OperatingSystemVersion.MacOsYosemite;
        case "15":
            return OperatingSystemVersion.MacOsElCapitan;
        case "16":
            return OperatingSystemVersion.MacOsSierra;
        case "17":
            return OperatingSystemVersion.MacOsHighSierra;
        case "18":
            return OperatingSystemVersion.MacOsMojave;
        case "19":
            return OperatingSystemVersion.MacOsCatalina;
        case "20":
            return OperatingSystemVersion.MacOsBigSur;
        default:
            throw new Error(`Unsupported macOS version: ${operatingSystemRelease}`);
    }
}

// For Linux we case more about desktop environment then OS version since most specific comes from it
function getLinuxVersion(): OperatingSystemVersion {
    const desktopEnvironment = process.env.XDG_CURRENT_DESKTOP
    switch (desktopEnvironment) {
        case "GNOME":
            return OperatingSystemVersion.LinuxGnome;
        case "X-Cinnamon":
            return OperatingSystemVersion.LinuxCinnamon;
        default:
            throw new Error(`Unsupported Linux desktop environment: ${desktopEnvironment}`);
    }
}