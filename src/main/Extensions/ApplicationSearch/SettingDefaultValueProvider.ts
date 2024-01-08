export interface SettingDefaultValueProvider {
    getDefaultValue<T>(settingKey: string): T;
}
