import { AppConfig } from "./app-config";
import { join } from "path";
import { homedir } from "os";

export class DefaultAppConfigManager {
    public static getDefaultAppConfig(): AppConfig {
        return {
            userSettingsFilePath: join(homedir(), "ueli.config.json"),
        };
    }
}
