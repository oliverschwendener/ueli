export interface SettingsManager {
    getExtensionSettingByKey<T>(extensionId: string, key: string, defaultValue: T): T;
    getSettingByKey<T>(key: string, defaultValue: T): T;
    saveSetting<T>(key: string, value: T): Promise<void>;
    saveExtensionSettingByKey<T>(extensionId: string, key: string, value: T): Promise<void>;
}
