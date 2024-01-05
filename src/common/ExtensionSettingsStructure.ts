export type ExtensionSettingList = {
    description: string;
    defaultValues: string[];
    id: string;
};

export type ExtensionSetting = ExtensionSettingList;

export type ExtensionSettingsStructure = ExtensionSetting[];
