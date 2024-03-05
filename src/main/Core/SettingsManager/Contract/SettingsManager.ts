/**
 * Offers methods to read and write settings.
 */
export interface SettingsManager {
    /**
     * Gets a value from the settings.
     * @param key The settings key
     * @param defaultValue The default value to return if no value has been set for the given key.
     * @param isSensitive Whether the value is sensitive and should be decrypted.
     */
    getValue<T>(key: string, defaultValue: T, isSensitive?: boolean): T;

    /**
     * Updates a value in the settings.
     * @param key The settings key
     * @param value The value to set
     * @param isSensitive Whether the value is sensitive and should be encrypted.
     */
    updateValue<T>(key: string, value: T, isSensitive?: boolean): Promise<void>;
}
