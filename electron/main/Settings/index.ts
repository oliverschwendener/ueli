import type { App } from "electron";
import { join } from "path";
import { SettingsManager } from "./SettingsManager";
import { SettingsFileReader } from "./SettingsFileReader";
import { SettingsFileWriter } from "./SettingsFileWriter";

export const useSettingsManager = (app: App): SettingsManager => {
    const settingsFilePath = join(app.getPath("userData"), "ueli9.settings.json");

    return new SettingsManager(new SettingsFileReader(settingsFilePath), new SettingsFileWriter(settingsFilePath));
};
