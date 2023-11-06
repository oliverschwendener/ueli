import type { BrowserWindowToggler } from "@common/BrowserWindowToggler";
import type { GlobalShortcut } from "electron";

export const useGlobalShortcut = ({
    browserWindowToggler,
    globalShortcut,
}: {
    globalShortcut: GlobalShortcut;
    browserWindowToggler: BrowserWindowToggler;
}) => {
    globalShortcut.unregisterAll();
    globalShortcut.register("alt+space", () => browserWindowToggler.toggleWindow());
};
