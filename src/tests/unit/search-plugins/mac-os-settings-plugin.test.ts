import { MacOsSettingsPlugin } from "../../../ts/search-plugins/mac-os-settings-plugin";
import { testIconSet } from "../../../ts/icon-sets/test-icon-set";

describe(MacOsSettingsPlugin.name, () => {
    const searchPlugin = new MacOsSettingsPlugin(testIconSet);

    describe(searchPlugin.getAllItems.name, () => {
        it("should return more than zero items", () => {
            const actual = searchPlugin.getAllItems();
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual.length).toBeGreaterThan(0);
        });
    });
});
