import { UserConfigOptions } from "./user-config-options";
import { readFileSync, existsSync, writeFileSync } from "fs";

export class UserConfigFileRepository {
    private readonly defaultConfig: UserConfigOptions;
    private readonly configFilePath: string;

    public constructor(defaultConfig: UserConfigOptions, configFilePath: string) {
        this.defaultConfig = defaultConfig;
        this.configFilePath = configFilePath;

        if (!existsSync(this.configFilePath)) {
            this.saveConfig(this.defaultConfig);
        }
    }

    public getConfig(): UserConfigOptions {
        try {
            const fileContent = readFileSync(this.configFilePath, "utf-8");
            const parsed = JSON.parse(fileContent) as UserConfigOptions;
            const mergedConfig = Object.assign(this.defaultConfig, parsed); // Apply defaults if some settings are not set
            return this.enforceDataTypes(mergedConfig);
        } catch (err) {
            return this.defaultConfig;
        }
    }

    public saveConfig(config: UserConfigOptions): void {
        config = this.enforceDataTypes(config);
        writeFileSync(this.configFilePath, JSON.stringify(config, null, 2), "utf-8");
    }

    private enforceDataTypes(config: UserConfigOptions): UserConfigOptions {
        config.calculatorPrecision = Number(config.calculatorPrecision);
        config.maxSearchResultCount = Number(config.maxSearchResultCount);
        config.rescanInterval = Number(config.rescanInterval);
        config.searchEngineLimit = Number(config.searchEngineLimit);
        config.searchEngineThreshold = Number(config.searchEngineThreshold);
        config.searchResultDescriptionFontSize = Number(config.searchResultDescriptionFontSize);
        config.searchResultHeight = Number(config.searchResultHeight);
        config.searchResultNameFontSize = Number(config.searchResultNameFontSize);
        config.userInputHeight = Number(config.userInputHeight);
        config.userInputFontSize = Number(config.userInputFontSize);
        config.windowMaxHeight = Number(config.windowMaxHeight);
        config.windowWidth = Number(config.windowWidth);

        config.webSearches.forEach((webSearch) => {
            webSearch.priority = Number(webSearch.priority);
        });

        return config;
    }
}
