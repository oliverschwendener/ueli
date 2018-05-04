import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { ConfigOptions } from "./config";

export class ConfigLoader {

    private configFilePath = path.join(os.homedir(), "ueli.config.json");
    private defaultConfig: ConfigOptions;
    public constructor(defaultConfig: ConfigOptions, configFilePath?: string) {
        if (configFilePath !== undefined) {
            this.configFilePath = configFilePath;
        }
        this.defaultConfig = defaultConfig;
    }

    public loadConfigFromConfigFile(): ConfigOptions {
        try {
            const fileContent = fs.readFileSync(this.configFilePath, "utf-8");
            const parsed = JSON.parse(fileContent) as ConfigOptions;
            // Apply defaults if some settings are not set
            const mergedConfig = Object.assign(this.defaultConfig, parsed);
            return mergedConfig;
        } catch (err) {
            this.writeDefaultConfigToConfigFile();
            return this.defaultConfig;
        }
    }

    private writeDefaultConfigToConfigFile(): void {
        const stringifiedConfig = JSON.stringify(this.defaultConfig);
        fs.writeFileSync(this.configFilePath, stringifiedConfig, "utf-8");
    }
}
