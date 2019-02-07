import { GlobalHotKey } from "../global-hot-key/global-hot-key";

export interface GeneralOptions {
    autostart: boolean;
    rescanIntervalInSeconds: number;
    hotKey: GlobalHotKey;
    clearCachesOnExit: boolean;
}
