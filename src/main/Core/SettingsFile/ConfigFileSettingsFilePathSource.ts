import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { App } from "electron";
import { join } from "path";
import type { SettingsFilePathSource } from "./SettingsFilePathSource";

export class ConfigFileSettingsFilePathSource implements SettingsFilePathSource {
    public constructor(
        private readonly app: App,
        private readonly fileSystemUtility: FileSystemUtility,
    ) {}

    public getSettingsFilePath(): string | undefined {
        const configFilePath = join(this.app.getPath("home"), "ueli9.config.json");

        if (this.fileSystemUtility.existsSync(configFilePath)) {
            const { settingsFilePath } = this.fileSystemUtility.readJsonFileSync<{ settingsFilePath?: string }>(
                configFilePath,
            );

            if (settingsFilePath) {
                return settingsFilePath;
            }
        }

        return undefined;
    }
}
