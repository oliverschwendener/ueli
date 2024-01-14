export interface SettingsManager {
    getValue<T>(key: string, defaultValue: T): T;
    getExtensionValue<T>(extensionId: string, key: string, defaultValue: T): T;
    updateValue<T>(key: string, value: T): Promise<void>;
    updateExtensionValue<T>(extensionId: string, key: string, value: T): Promise<void>;
}
