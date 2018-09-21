import { ConfigOptions } from "./config-options";
import { readFileSync, existsSync, writeFileSync } from "fs";

export class ConfigFileRepository {
    private defaultConfig: ConfigOptions;
    private configFilePath: string;

    public constructor(defaultConfig: ConfigOptions, configFilePath: string) {
        this.defaultConfig = defaultConfig;
        this.configFilePath = configFilePath;

        if (!existsSync(this.configFilePath)) {
            this.saveConfig(this.defaultConfig);
        }
    }

    public getConfig(): ConfigOptions {
        try {
            const fileContent = readFileSync(this.configFilePath, "utf-8");
            const parsed = JSON.parse(fileContent) as ConfigOptions;

            const mergedConfig = Object.assign(this.defaultConfig, parsed); // Apply defaults if some settings are not set

            return mergedConfig;
        } catch (err) {
            return this.defaultConfig;
        }
    }

    public saveConfig(config: ConfigOptions): void {
        writeFileSync(this.configFilePath, JSON.stringify(config, null, 2), "utf-8");
    }
}
