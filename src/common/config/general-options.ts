import { GlobalHotKey } from "../global-hot-key/global-hot-key";
import { Language } from "../translation/language";

export interface GeneralOptions {
    autostart: boolean;
    rescanIntervalInSeconds: number;
    rescanEnabled: boolean;
    hotKey: GlobalHotKey;
    language: Language;
    clearCachesOnExit: boolean;
    showTrayIcon: boolean;
    showAlwaysOnPrimaryDisplay: boolean;
}
