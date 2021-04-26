import { getMacOsApplicationSearcherCommand } from "./application-searcher";
import { OperatingSystemVersion } from "../../common/operating-system";

describe(getMacOsApplicationSearcherCommand, () => {
    it(`should return 'mdfind "kind:apps"' on macOS 10.14 (Mojave) and older`, () => {
        const macOsVersions = [
            OperatingSystemVersion.MacOsYosemite,
            OperatingSystemVersion.MacOsElCapitan,
            OperatingSystemVersion.MacOsSierra,
            OperatingSystemVersion.MacOsHighSierra,
            OperatingSystemVersion.MacOsMojave,
        ];

        macOsVersions.forEach((macOsVersion) => {
            expect(getMacOsApplicationSearcherCommand(macOsVersion)).toBe(`mdfind "kind:apps"`);
        });
    });

    it("should return 'mdfind kMDItemContentTypeTree=com.apple.application-bundle' on macOS 10.15 (Catalina) and newer", () => {
        const expected = "mdfind kMDItemContentTypeTree=com.apple.application-bundle";
        const actual = getMacOsApplicationSearcherCommand(OperatingSystemVersion.MacOsCatalina);
        expect(actual).toBe(expected);
    });
});
