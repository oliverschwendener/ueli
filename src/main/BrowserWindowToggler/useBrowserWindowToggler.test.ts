import type { App, BrowserWindow } from "electron";
import { describe, expect, it } from "vitest";
import { ElectronBrowserWindowToggler } from "./ElectronBrowserWindowToggler";
import { useBrowserWindowToggler } from "./useBrowserWindowToggler";

describe(useBrowserWindowToggler, () => {
    it("should return an instance of ElectronBrowserWindowToggler", () => {
        const app = <App>{};
        const browserWindow = <BrowserWindow>{};

        expect(useBrowserWindowToggler({ app, browserWindow })).toEqual(
            new ElectronBrowserWindowToggler(app, browserWindow),
        );
    });
});
