import { Windows10SettingsSearchPlugin } from "../../../ts/search-plugins/windows-10-settings-plugin";
import { testIconSet } from "../../../ts/icon-sets/test-icon-set";
import { allWindows10Apps } from "../../../ts/operating-system-settings/windows/windows-10-apps";
import { allWindowsSettings } from "../../../ts/operating-system-settings/windows/windows-settings";

describe(Windows10SettingsSearchPlugin.name, (): void => {
    const searchPlugin = new Windows10SettingsSearchPlugin(testIconSet);

    describe(searchPlugin.getAllItems.name, (): void => {
        it("should return more than zero items", () => {
            const actual = searchPlugin.getAllItems();
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual.length).toBeGreaterThan(0);
        });
    });

    describe(searchPlugin.getIndexLength.name, (): void => {
        it("should return the number of settings", (): void => {
            const actual = searchPlugin.getIndexLength();
            const expected = allWindows10Apps.length + allWindowsSettings.length;
            expect(actual).toBe(expected);
        });
    });
});
