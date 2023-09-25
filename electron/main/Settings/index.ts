import type { App } from "electron";
import { join } from "path";
import { SettingsFileReader } from "./SettingsFileReader";
import { SettingsFileWriter } from "./SettingsFileWriter";
import { SettingsManager } from "./SettingsManager";

export type * from "./SettingsManager";

export const useSettingsManager = ({ app }: { app: App }): SettingsManager => {
    const settingsFilePath = join(app.getPath("userData"), "ueli9.settings.json");

    return new SettingsManager(new SettingsFileReader(settingsFilePath), new SettingsFileWriter(settingsFilePath));
};
