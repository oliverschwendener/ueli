import type { GlobalShortcut } from "electron";
import type { BrowserWindowToggler } from "../BrowserWindow";

export const useGlobalShortcut = ({
    browserWindowToggler,
    globalShortcut,
}: {
    globalShortcut: GlobalShortcut;
    browserWindowToggler: BrowserWindowToggler;
}) => globalShortcut.register("alt+space", browserWindowToggler.toggleWindow);
