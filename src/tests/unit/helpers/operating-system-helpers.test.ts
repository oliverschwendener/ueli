import { OperatingSystemHelpers } from "../../../ts/helpers/operating-system-helpers";
import { OperatingSystem } from "../../../ts/operating-system";
import { OperatingSystemNotSupportedError } from "../../../ts/errors/operatingsystem-not-supported-error";

describe(OperatingSystemHelpers.name, () => {
    describe(OperatingSystemHelpers.getOperatingSystemFromString.name, () => {
        it("should return windows when passing in win32", () => {
            const platform = "win32";

            const actual = OperatingSystemHelpers.getOperatingSystemFromString(platform);

            expect(actual).toBe(OperatingSystem.Windows);
        });

        it("should return mac os when passing in darwin", () => {
            const platform = "darwin";

            const actual = OperatingSystemHelpers.getOperatingSystemFromString(platform);

            expect(actual).toBe(OperatingSystem.macOS);
        });

        it("should throw an error when passing in an unsupported operating system", (): void => {
            const unsupportedPlatforms = [
                "linux",
                "win",
                "windows",
                "macos",
                "mac",
            ];

            let errorCounter = 0;

            for (const unsupportedPlatform of unsupportedPlatforms) {
                try {
                    OperatingSystemHelpers.getOperatingSystemFromString(unsupportedPlatform);
                } catch (error) {
                    expect(error instanceof OperatingSystemNotSupportedError).toBe(true);
                    errorCounter++;
                }
            }

            expect(errorCounter).toBe(unsupportedPlatforms.length);
        });
    });
});
