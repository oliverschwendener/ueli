import type { App } from "electron";
import { describe, expect, it, vi } from "vitest";
import { DefaultAutostartManager } from "./DefaultAutostartManager";

describe(DefaultAutostartManager, () => {
    describe(DefaultAutostartManager.prototype.setAutostartOptions, () => {
        const testSetAutostartOptions = ({ openAtLogin }: { openAtLogin: boolean }) => {
            const process = <NodeJS.Process>{ execPath: "execPath" };
            const setLoginItemSettingsMock = vi.fn();
            const app = <App>{ setLoginItemSettings: (s) => setLoginItemSettingsMock(s) };

            new DefaultAutostartManager(app, process).setAutostartOptions(openAtLogin);

            expect(setLoginItemSettingsMock).toHaveBeenCalledOnce();
            expect(setLoginItemSettingsMock).toHaveBeenCalledWith({ args: [], openAtLogin, path: "execPath" });
        };

        it("should set autostart the correct login items when openAtLogin is true", () =>
            testSetAutostartOptions({ openAtLogin: true }));

        it("should set autostart the correct login items when openAtLogin is false", () =>
            testSetAutostartOptions({ openAtLogin: false }));
    });

    describe(DefaultAutostartManager.prototype.autostartIsEnabled, () => {
        it("should return true when openAtLogin is true", () => {
            const getLoginItemSettingsMock = vi.fn().mockReturnValue({ openAtLogin: true });
            const app = <App>{ getLoginItemSettings: () => getLoginItemSettingsMock() };
            expect(new DefaultAutostartManager(app, <NodeJS.Process>{}).autostartIsEnabled()).toBe(true);
            expect(getLoginItemSettingsMock).toHaveBeenCalledOnce();
        });

        it("should return true when openAtLogin is true", () => {
            const getLoginItemSettingsMock = vi.fn().mockReturnValue({ openAtLogin: false });
            const app = <App>{ getLoginItemSettings: () => getLoginItemSettingsMock() };
            expect(new DefaultAutostartManager(app, <NodeJS.Process>{}).autostartIsEnabled()).toBe(false);
            expect(getLoginItemSettingsMock).toHaveBeenCalledOnce();
        });
    });
});
