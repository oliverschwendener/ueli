import type { Settings } from "../../Settings";

export interface SettingsManager {
    getSettings(): Settings;
    getPluginSettingByKey<T>(pluginId: string, key: string, defaultValue: T): T;
    getSettingByKey<T>(key: string, defaultValue: T): T;
    saveSetting<T>(key: string, value: T): Promise<void>;
}
