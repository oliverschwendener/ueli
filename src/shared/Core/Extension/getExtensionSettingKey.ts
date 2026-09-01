/**
 * Gets the setting key for an extension.
 * @param extensionId The extension ID, e.g. `"MyCustomExtension"`.
 * @param settingKey The setting key, e.g. `"mySetting"`.
 * @returns The setting key for the extension, e.g. `"extension[MyCustomExtension].mySetting"`.
 */
export const getExtensionSettingKey = (extensionId: string, settingKey: string) =>
    `extension[${extensionId}].${settingKey}`;
