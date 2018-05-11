import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { ConfigOptions } from "./config-options";
import { ConfigRepository } from "./config-repository";
import { UeliHelpers } from "./helpers/ueli-helpers";

export class ConfigFileRepository implements ConfigRepository {
    private configFilePath = UeliHelpers.configFilePath;
    private defaultConfig: ConfigOptions;

    public constructor(defaultConfig: ConfigOptions, configFilePath?: string) {
        if (configFilePath !== undefined) {
            this.configFilePath = configFilePath;
        }

        this.defaultConfig = defaultConfig;
    }

    public getConfig(): ConfigOptions {
        try {
            const fileContent = fs.readFileSync(this.configFilePath, "utf-8");
            const parsed = JSON.parse(fileContent) as ConfigOptions;
            // Apply defaults if some settings are not set
            const mergedConfig = Object.assign(this.defaultConfig, parsed);
            return mergedConfig;
        } catch (err) {
            return this.defaultConfig;
        }
    }

    public saveConfig(): void {
        const stringifiedConfig = JSON.stringify(this.defaultConfig, null, 2);
        fs.writeFileSync(this.configFilePath, stringifiedConfig, "utf-8");
    }
}
