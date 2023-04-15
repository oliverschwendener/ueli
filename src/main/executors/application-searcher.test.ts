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
            expect(getMacOsApplicationSearcherCommand(macOsVersion, ['/dir1','/dir2'])).toBe(`mdfind "kind:apps" | egrep "/dir1|/dir2"`);
        });
    });

    it("should return 'mdfind kMDItemContentTypeTree=com.apple.application-bundle' on macOS 10.15 (Catalina) and newer", () => {
        const expected = `find '/dir1' '/dir2' -type d -iname '*.app' -maxdepth 2 -prune`;
        const actual = getMacOsApplicationSearcherCommand(OperatingSystemVersion.MacOsCatalina, ['/dir1','/dir2']);
        expect(actual).toBe(expected);
    });
});
