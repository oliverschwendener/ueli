import { OperatingSystemHelpers } from "../../../ts/helpers/operating-system-helpers";
import { OperatingSystem } from "../../../ts/operating-system";

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
    });
});
