import { AppConfig } from "./app-config";
import { join } from "path";
// import { homedir } from "os";
import { cwd } from "process";

export class DefaultAppConfigManager {
    public static getDefaultAppConfig(): AppConfig {
        return {
            userSettingsFilePath: join(cwd(), "ueli.config.json"),
        };
    }
}
