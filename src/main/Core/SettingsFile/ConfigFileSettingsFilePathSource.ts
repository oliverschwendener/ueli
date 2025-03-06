import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { App } from "electron";
import { join } from "path";
import type { SettingsFilePathSource } from "./SettingsFilePathSource";

type Config = {
    settingsFilePath?: string;
};

export class ConfigFileSettingsFilePathSource implements SettingsFilePathSource {
    public constructor(
        private readonly app: App,
        private readonly fileSystemUtility: FileSystemUtility,
    ) {}

    public getSettingsFilePath(): string | undefined {
        const configFilePath = this.getConfigFilePath();

        if (this.fileSystemUtility.existsSync(configFilePath)) {
            const { settingsFilePath } = this.fileSystemUtility.readJsonFileSync<Config>(configFilePath);

            if (settingsFilePath) {
                return settingsFilePath;
            }
        }

        return undefined;
    }

    public async writeFilePathToConfigFile(filePath: string): Promise<void> {
        const config: Config = { settingsFilePath: filePath };
        await this.fileSystemUtility.writeJsonFile(config, this.getConfigFilePath());
    }

    private getConfigFilePath(): string {
        return join(this.app.getPath("home"), "ueli9.config.json");
    }
}
