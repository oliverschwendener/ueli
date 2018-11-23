import { AppConfig } from "./app-config";
import { join } from "path";
import { homedir } from "os";
import { cwd } from "process";

export class DefaultAppConfigManager {
    public static getDefaultAppConfig(): AppConfig {
        return {
            iconStorePath: join(cwd(), "icon-store"),
            userSettingsFilePath: join(homedir(), "ueli.config.json"),
        };
    }
}
