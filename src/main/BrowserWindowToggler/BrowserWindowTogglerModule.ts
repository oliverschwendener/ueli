import type { BrowserWindowToggler } from "@common/BrowserWindowToggler";
import type { DependencyInjector } from "@common/DependencyInjector";
import type { App, BrowserWindow } from "electron";
import { ElectronBrowserWindowToggler } from "./ElectronBrowserWindowToggler";

export class BrowserWindowTogglerModule {
    public static bootstrap(dependencyInjector: DependencyInjector) {
        const app = dependencyInjector.getInstance<App>("App");
        const browserWindow = dependencyInjector.getInstance<BrowserWindow>("BrowserWindow");

        dependencyInjector.registerInstance<BrowserWindowToggler>(
            "BrowserWindowToggler",
            new ElectronBrowserWindowToggler(app, browserWindow),
        );
    }
}
