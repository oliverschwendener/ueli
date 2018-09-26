import { Windows10SettingsSearchPlugin } from "../../../ts/search-plugins/windows-10-settings-plugin";
import { testIconSet } from "../../../ts/icon-sets/test-icon-set";

describe(Windows10SettingsSearchPlugin.name, () => {
    const searchPlugin = new Windows10SettingsSearchPlugin(testIconSet);

    describe(searchPlugin.getAllItems.name, () => {
        it("should return more than zero items", () => {
            const actual = searchPlugin.getAllItems();
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual.length).toBeGreaterThan(0);
        });
    });
});
