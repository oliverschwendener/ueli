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
            return this.enforceDataTypes(mergedConfig);
        } catch (err) {
            return this.defaultConfig;
        }
    }

    public saveConfig(config: ConfigOptions): void {
        config = this.enforceDataTypes(config);
        writeFileSync(this.configFilePath, JSON.stringify(config, null, 2), "utf-8");
    }

    private enforceDataTypes(config: ConfigOptions): ConfigOptions {
        config.maxSearchResultCount = Number(config.maxSearchResultCount);
        config.rescanInterval = Number(config.rescanInterval);
        config.searchEngineThreshold = Number(config.searchEngineThreshold);
        config.searchResultDescriptionFontSize = Number(config.searchResultDescriptionFontSize);
        config.searchResultHeight = Number(config.searchResultHeight);
        config.searchResultNameFontSize = Number(config.searchResultNameFontSize);
        config.userInputHeight = Number(config.userInputHeight);
        config.userInputFontSize = Number(config.userInputFontSize);
        config.windowWidth = Number(config.windowWidth);
        return config;
    }
}
