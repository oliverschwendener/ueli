import { MacOsSettingsPlugin } from "../../../ts/search-plugins/mac-os-settings-plugin";
import { testIconSet } from "../../../ts/icon-sets/test-icon-set";
import { MacOsSetting } from "../../../ts/operating-system-settings/macos/mac-os-setting";

describe(MacOsSettingsPlugin.name, (): void => {
    const testSettings: MacOsSetting[] = [
        { executionArgument: "exec-1", name: "name-1", tags: [] },
        { executionArgument: "exec-2", name: "name-2", tags: [] },
        { executionArgument: "exec-3", name: "name-3", tags: [] },
        { executionArgument: "exec-4", name: "name-4", tags: [] },
    ];

    const searchPlugin = new MacOsSettingsPlugin(testSettings, testIconSet);

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
            const expected = testSettings.length;

            expect(actual).toBe(expected);
        });
    });
});
