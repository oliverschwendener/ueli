import { GeneralOptions } from "./general-options";
import { GlobalHotKeyKey } from "../global-hot-key/global-hot-key-key";
import { GlobalHotKeyModifier } from "../global-hot-key/global-hot-key-modifier";
import { Language } from "../translation/language";

export const defaultGeneralOptions: GeneralOptions = {
    autostart: true,
    clearCachesOnExit: false,
    hotKey: {
        key: GlobalHotKeyKey.Space,
        modifier: GlobalHotKeyModifier.Alt,
    },
    language: Language.English,
    logExecution: true,
    persistentUserInput: false,
    rememberWindowPosition: false,
    rescanEnabled: true,
    rescanIntervalInSeconds: 300,
    showAlwaysOnPrimaryDisplay: false,
    showTrayIcon: true,
};
