import { MacOsSettingsPlugin } from "../../../ts/search-plugins/mac-os-settings-plugin";
import { testIconSet } from "../../../ts/icon-sets/test-icon-set";
import { allMacOsSettings } from "../../../ts/operating-system-settings/macos/mac-os-settings";

describe(MacOsSettingsPlugin.name, (): void => {
    const searchPlugin = new MacOsSettingsPlugin(testIconSet);

    describe(searchPlugin.getAllItems.name, (): void => {
        it("should return more than zero items", () => {
            const actual = searchPlugin.getAllItems();
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual.length).toBeGreaterThan(0);
        });
    });

    describe(searchPlugin.getIndexLength.name, (): void => {
        it("should return the number of os settings", (): void => {
            const actual = searchPlugin.getIndexLength();
            const expected = allMacOsSettings.length;

            expect(actual).toBe(expected);
        });
    });
});
