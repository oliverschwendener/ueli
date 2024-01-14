export const getExtensionSettingKey = (extensionId: string, settingKey: string) =>
    `extension[${extensionId}].${settingKey}`;
