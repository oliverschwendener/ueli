import { AppConfig } from "./app-config";
import { join } from "path";
import { ueliTempDir } from "./ueli-temp-dir";

export class DefaultAppConfigManager {
    public static getDefaultAppConfig(): AppConfig {
        return {
            appIconStorePath: join(ueliTempDir, "app-icon-store"),
            countFilePath: join(ueliTempDir, "ueli.count.json"),
            userSettingsFilePath: join(ueliTempDir, "ueli.config.json"),
        };
    }
}
