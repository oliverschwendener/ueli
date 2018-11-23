import { AppConfig } from "./app-config";
import { join } from "path";
import { ueliTempDir } from "./ueli-temp-dir";

export class DefaultAppConfigManager {
    public static getDefaultAppConfig(): AppConfig {
        return {
            countFilePath: join(ueliTempDir, "ueli.count.json"),
            iconStorePath: join(ueliTempDir, "icon-store"),
            userSettingsFilePath: join(ueliTempDir, "ueli.config.json"),
        };
    }
}
