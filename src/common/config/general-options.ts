import { Language } from "../translation/language";
import { GlobalHotKey } from "../global-hot-key/global-hot-key";
import { GlobalHotKeyKey } from "../global-hot-key/global-hot-key-key";
import { GlobalHotKeyModifier } from "../global-hot-key/global-hot-key-modifier";
import { WindowPosition } from "../window-position";

export interface GeneralOptions {
    allowWindowMove: boolean;
    autostart: boolean;
    clearCachesOnExit: boolean;
    hideMainWindowAfterExecution: boolean;
    hideMainWindowOnBlur: boolean;
    hotKey: GlobalHotKey;
    language: Language;
    logExecution: boolean;
    persistentUserInput: boolean;
    rememberWindowPosition: boolean;
    rescanEnabled: boolean;
    rescanIntervalInSeconds: number;
    showAlwaysOnPrimaryDisplay: boolean;
    showTrayIcon: boolean;
    decimalSeparator: string;
    lastWindowPosition?: WindowPosition;
}

export const defaultGeneralOptions: GeneralOptions = {
    allowWindowMove: true,
    autostart: true,
    clearCachesOnExit: false,
    hideMainWindowAfterExecution: true,
    hideMainWindowOnBlur: true,
    hotKey: {
        key: GlobalHotKeyKey.Space,
        modifier: GlobalHotKeyModifier.Alt,
        secondModifier: GlobalHotKeyModifier.None,
    },
    language: Language.English,
    logExecution: true,
    persistentUserInput: false,
    rememberWindowPosition: false,
    rescanEnabled: true,
    rescanIntervalInSeconds: 300,
    showAlwaysOnPrimaryDisplay: false,
    showTrayIcon: true,
    decimalSeparator: ".",
};
