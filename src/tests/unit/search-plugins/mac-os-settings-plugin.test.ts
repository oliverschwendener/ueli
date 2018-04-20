import { MacOsSettingsPlugin } from "../../../ts/search-plugins/mac-os-settings-plugin";

describe(MacOsSettingsPlugin.name, () => {
    const searchPlugin = new MacOsSettingsPlugin();

    describe(searchPlugin.getAllItems.name, () => {
        it("returns exactly zero items because it is not implemented yet", () => {
            const actual = searchPlugin.getAllItems();
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual.length).toBe(0);
        });
    });
});
