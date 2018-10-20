import { Windows10SettingsSearchPlugin } from "../../../ts/search-plugins/windows-10-settings-plugin";
import { testIconSet } from "../../../ts/icon-sets/test-icon-set";
import { WindowsSetting } from "../../../ts/operating-system-settings/windows/windows-setting";
import { Windows10App } from "../../../ts/operating-system-settings/windows/windows-10-app";

describe(Windows10SettingsSearchPlugin.name, (): void => {
    const testSettings: WindowsSetting[] = [
        { executionArgument: "exec-1", name: "setting-1", tags: [] },
        { executionArgument: "exec-2", name: "setting-2", tags: [] },
        { executionArgument: "exec-3", name: "setting-3", tags: [] },
        { executionArgument: "exec-4", name: "setting-4", tags: [] },
    ];

    const testApps: Windows10App[] = [
        { executionArgument: "exec-1", name: "app-1", icon: "icon" },
        { executionArgument: "exec-2", name: "app-2", icon: "icon" },
        { executionArgument: "exec-3", name: "app-3", icon: "icon" },
        { executionArgument: "exec-4", name: "app-4", icon: "icon" },
    ];

    const searchPlugin = new Windows10SettingsSearchPlugin(testSettings, testApps, testIconSet);

    describe(searchPlugin.getAllItems.name, (): void => {
        it("should return more than zero items", () => {
            const actual = searchPlugin.getAllItems();
            expect(actual.length).toBe(testSettings.length + testApps.length);
        });
    });

    describe(searchPlugin.getIndexLength.name, (): void => {
        it("should return the number of settings", (): void => {
            const actual = searchPlugin.getIndexLength();
            const expected = testSettings.length + testApps.length;
            expect(actual).toBe(expected);
        });
    });
});
