import { Windows10SettingsSearchPlugin } from "../../../ts/search-plugins/windows-10-settings-plugin";

describe(Windows10SettingsSearchPlugin.name, () => {
    const searchPlugin = new Windows10SettingsSearchPlugin();

    describe(searchPlugin.getAllItems.name, () => {
        it("should return more than zero items", () => {
            const actual = searchPlugin.getAllItems();
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual.length).toBeGreaterThan(0);
        });
    });
});
