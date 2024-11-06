import { OperatingSystem, OperatingSystemVersion } from "../operating-system";

export function getCurrentOperatingSystem(platform: string): OperatingSystem {
    switch (platform) {
        case "win32":
            return OperatingSystem.Windows;
        case "darwin":
            return OperatingSystem.macOS;
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
    const darwinKernelVersion = Number(operatingSystemRelease.substr(0, 2));

    if (darwinKernelVersion < 14) {
        throw new Error(`Unsupported macOS version: ${operatingSystemRelease}`);
    }

    if (darwinKernelVersion === 14) {
        return OperatingSystemVersion.MacOsYosemite;
    }
    if (darwinKernelVersion === 15) {
        return OperatingSystemVersion.MacOsElCapitan;
    }
    if (darwinKernelVersion === 16) {
        return OperatingSystemVersion.MacOsSierra;
    }
    if (darwinKernelVersion === 17) {
        return OperatingSystemVersion.MacOsHighSierra;
    }
    if (darwinKernelVersion === 18) {
        return OperatingSystemVersion.MacOsMojave;
    }
    if (darwinKernelVersion === 19) {
        return OperatingSystemVersion.MacOsCatalina;
    }
    if (darwinKernelVersion === 20) {
        return OperatingSystemVersion.MacOsBigSur;
    }
    if (darwinKernelVersion === 21) {
        return OperatingSystemVersion.MacOsMonterey;
    }
    if (darwinKernelVersion === 22) {
        return OperatingSystemVersion.MacOsVentura;
    }

    if (darwinKernelVersion >= 23) {
        return OperatingSystemVersion.MacOsSonoma;
    }

    throw new Error(`Unsupported macOS version: ${operatingSystemRelease}`);
}
