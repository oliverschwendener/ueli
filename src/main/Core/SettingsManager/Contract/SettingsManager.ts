export interface SettingsManager {
    getValue<T>(key: string, defaultValue: T, isSensitive?: boolean): T;
    updateValue<T>(key: string, value: T, isSensitive?: boolean): Promise<void>;
}
