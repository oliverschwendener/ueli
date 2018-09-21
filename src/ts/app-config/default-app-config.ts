import { AppConfig } from "./app-config";
import { join } from "path";
import { homedir } from "os";

export const defaultAppConfig: AppConfig = {
    userSettingsFilePath: join(homedir(), "ueli.config.json"),
};
