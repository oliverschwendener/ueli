import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { App } from "electron";
import { join } from "path";

type Config = { settingsFilePath?: string };

export class CustomSettingsFilePathResolver {
    private configFilePath: string;

    public constructor(
        private readonly app: App,
        private readonly fileSystemUtility: FileSystemUtility,
    ) {
        this.configFilePath = join(this.app.getPath("home"), "ueli9.config.json");
    }

    public isEnabled(): boolean {
        return this.resolve() !== undefined;
    }

    public resolve(): string | undefined {
        return this.getConfig().settingsFilePath;
    }

    public async writeFilePathToConfigFile(filePath: string) {
        const config = this.getConfig();
        config.settingsFilePath = filePath;
        await this.fileSystemUtility.writeJsonFile(config, this.configFilePath);
    }

    public async remove() {
        const config = this.getConfig();
        delete config.settingsFilePath;
        this.fileSystemUtility.writeJsonFileSync(config, this.configFilePath);
    }

    private getConfig(): Config {
        return this.fileSystemUtility.existsSync(this.configFilePath)
            ? this.fileSystemUtility.readJsonFileSync<Config>(this.configFilePath)
            : {};
    }
}
