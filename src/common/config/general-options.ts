import { GlobalHotKey } from "../global-hot-key/global-hot-key";
import { Language } from "../translation/language";

export interface GeneralOptions {
    autostart: boolean;
    clearCachesOnExit: boolean;
    hotKey: GlobalHotKey;
    language: Language;
    logExecution: boolean;
    persistentUserInput: boolean;
    rememberWindowPosition: boolean;
    rescanEnabled: boolean;
    rescanIntervalInSeconds: number;
    showAlwaysOnPrimaryDisplay: boolean;
    showTrayIcon: boolean;
}
