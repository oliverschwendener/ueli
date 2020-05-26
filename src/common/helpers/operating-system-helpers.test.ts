import { isWindows, isMacOs, getCurrentOperatingSystem } from "./operating-system-helpers";
import { OperatingSystem } from "../operating-system";

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
    "gugus"
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

describe(isWindows, () => {
    it(`should return true when passing in win32`, () => {
        expect(isWindows(windowsPlatformIdentifier)).toBe(true);
    });

    it("should return false when passing in a non windows platform identifier", () => {
        invalidWindowsPlatformIdentifiers.forEach((invalidWindowsPlatformIdentifier) => {
            expect(isWindows(invalidWindowsPlatformIdentifier)).toBe(false);
        });
    });
});

describe(isMacOs, () => {
    it("should return true when passing in darwin", () => {
        expect(isMacOs(macOsPlatformIdentifier)).toBe(true);
    });

    it("should return false when passing in a non macOS platform identifier", () => {
        invalidMacOsPlatformIdentifiers.forEach((invalidMacOsPlatformIdentifier) => {
            expect(isMacOs(invalidMacOsPlatformIdentifier)).toBe(false);
        });
    });
});

describe(getCurrentOperatingSystem, () => {
    it(`it should return ${OperatingSystem.Windows} when passing in win32`, () => {
        expect(getCurrentOperatingSystem(windowsPlatformIdentifier)).toBe(OperatingSystem.Windows);
    });

    it(`it should return ${OperatingSystem.macOS} when passing in darwin`, () => {
        expect(getCurrentOperatingSystem(macOsPlatformIdentifier)).toBe(OperatingSystem.macOS);
    })

    it("should throw an error when passing in an unsupported platform identifier", () => {
        let errorCounter = 0;

        const unsupportedPlatformIdentifiers = [
            "linux",
            "freebsd",
            "openbsd",
            "sunos",
            "bsd",
            "aix",
            "whatever",
        ];

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
