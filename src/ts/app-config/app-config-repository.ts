import { AppConfig } from "./app-config";

export interface AppConfigRepository {
    getAppConfig(): AppConfig;
    setAppConfig(newAppConfig: AppConfig): void;
}
