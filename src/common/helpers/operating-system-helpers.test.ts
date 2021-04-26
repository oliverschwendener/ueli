import { getCurrentOperatingSystem, getOperatingSystemVersion } from "./operating-system-helpers";
import { OperatingSystem, OperatingSystemVersion } from "../operating-system";

const windowsPlatformIdentifier = "win32";
const invalidWindowsPlatformIdentifiers = [
    "",
    "   ",
    "win",
    "windows",
    "nt",
    "Windows",
    "WINDOWS",
    "Win10",
    "Windows 10",
    "MS windows",
    "1234",
    "gugus",
];

const macOsPlatformIdentifier = "darwin";
const invalidMacOsPlatformIdentifiers = [
    "",
    "  ",
    "macOS",
    "mac",
    "macos",
    "mac operating system",
    "macintosh",
    "apple",
    "shit",
];

describe(getCurrentOperatingSystem, () => {
    it(`it should return ${OperatingSystem.Windows} when passing in win32`, () => {
        expect(getCurrentOperatingSystem(windowsPlatformIdentifier)).toBe(OperatingSystem.Windows);
    });

    it(`it should return ${OperatingSystem.macOS} when passing in darwin`, () => {
        expect(getCurrentOperatingSystem(macOsPlatformIdentifier)).toBe(OperatingSystem.macOS);
    });

    it("should throw an error when passing in an unsupported platform identifier", () => {
        let errorCounter = 0;

        const unsupportedPlatformIdentifiers = ["linux", "freebsd", "openbsd", "sunos", "bsd", "aix", "whatever"];

        invalidWindowsPlatformIdentifiers.forEach((invalidWindowsPlatformIdentifier) => {
            unsupportedPlatformIdentifiers.push(invalidWindowsPlatformIdentifier);
        });

        invalidMacOsPlatformIdentifiers.forEach((invalidMacOsPlatformIdentifier) => {
            unsupportedPlatformIdentifiers.push(invalidMacOsPlatformIdentifier);
        });

        unsupportedPlatformIdentifiers.forEach((unsupportedPlatformIdentifier) => {
            try {
                getCurrentOperatingSystem(unsupportedPlatformIdentifier);
            } catch (error) {
                errorCounter++;
            }
        });

        expect(errorCounter).toBe(unsupportedPlatformIdentifiers.length);
    });
});

describe(getOperatingSystemVersion, () => {
    it("should return the correct macOS version by the given darwin kernel version", () => {
        const versions = [
            {
                kernelVersion: "14.x.x",
                macOsVersion: OperatingSystemVersion.MacOsYosemite,
            },
            {
                kernelVersion: "15.x.x",
                macOsVersion: OperatingSystemVersion.MacOsElCapitan,
            },
            {
                kernelVersion: "16.x.x",
                macOsVersion: OperatingSystemVersion.MacOsSierra,
            },
            {
                kernelVersion: "17.x.x",
                macOsVersion: OperatingSystemVersion.MacOsHighSierra,
            },
            {
                kernelVersion: "18.x.x",
                macOsVersion: OperatingSystemVersion.MacOsMojave,
            },
            {
                kernelVersion: "19.x.x",
                macOsVersion: OperatingSystemVersion.MacOsCatalina,
            },
            {
                kernelVersion: "20.x.x",
                macOsVersion: OperatingSystemVersion.MacOsBigSur,
            },
        ];

        versions.forEach((version) => {
            expect(getOperatingSystemVersion(OperatingSystem.macOS, version.kernelVersion)).toBe(version.macOsVersion);
        });
    });

    it("should throw an error when passing in an unsupported darwin kernel version", () => {
        const unsupportedKernelVersions = ["", " ", "          ", "1", "abc", "10.x.x", "11", "12", "13", "21", "22"];

        let errorCounter = 0;

        unsupportedKernelVersions.forEach((unsupportedKernelVersion) => {
            try {
                getOperatingSystemVersion(OperatingSystem.macOS, unsupportedKernelVersion);
            } catch (error) {
                errorCounter++;
            }
        });

        expect(errorCounter).toBe(unsupportedKernelVersions.length);
    });

    it("should return the correct Windows version by the given windows release", () => {
        const versions = [
            {
                release: "10.x.x",
                windowsVersion: OperatingSystemVersion.Windows10,
            },
            {
                release: "6.3",
                windowsVersion: OperatingSystemVersion.Windows8_1,
            },
            {
                release: "6.2",
                windowsVersion: OperatingSystemVersion.Windows8,
            },
            {
                release: "6.1",
                windowsVersion: OperatingSystemVersion.Windows7,
            },
        ];

        versions.forEach((version) => {
            expect(getOperatingSystemVersion(OperatingSystem.Windows, version.release)).toBe(version.windowsVersion);
        });
    });

    it("should throw an error when passing in an invalid windows release", () => {
        let errorCounter = 0;

        const invalidWindowsReleases = [
            "",
            " ",
            "      ",
            "1",
            "2",
            "5",
            "6",
            "61",
            "62",
            "63",
            "6_3",
            "10",
            "10_",
            "11",
            "abc",
            "undefined",
        ];

        invalidWindowsReleases.forEach((invalidWindowsRelease) => {
            try {
                getOperatingSystemVersion(OperatingSystem.Windows, invalidWindowsRelease);
            } catch (error) {
                errorCounter++;
            }
        });

        expect(errorCounter).toBe(invalidWindowsReleases.length);
    });
});
