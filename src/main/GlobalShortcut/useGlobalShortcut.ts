import type { BrowserWindowToggler } from "@common/BrowserWindowToggler";
import type { DependencyInjector } from "@common/DependencyInjector";
import type { GlobalShortcut } from "electron";

export const useGlobalShortcut = (dependencyInjector: DependencyInjector) => {
    const browserWindowToggler = dependencyInjector.getInstance<BrowserWindowToggler>("BrowserWindowToggler");
    const globalShortcut = dependencyInjector.getInstance<GlobalShortcut>("GlobalShortcut");

    globalShortcut.unregisterAll();
    globalShortcut.register("alt+space", () => browserWindowToggler.toggleWindow());
};
