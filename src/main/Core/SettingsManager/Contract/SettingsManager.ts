export interface SettingsManager {
    getValue<T>(key: string, defaultValue: T): T;
    updateValue<T>(key: string, value: T): Promise<void>;
}
