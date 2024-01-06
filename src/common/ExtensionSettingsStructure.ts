import type { OpenDialogOptions } from "electron";

export type ExtensionSettingList = {
    description: string;
    defaultValues: string[];
    id: string;
    newValuePlaceholder: string;
    openDialogOptions?: OpenDialogOptions;
};

export type ExtensionSetting = ExtensionSettingList;

export type ExtensionSettingsStructure = ExtensionSetting[];
