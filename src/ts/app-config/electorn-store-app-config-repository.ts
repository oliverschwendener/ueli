import { AppConfigRepository } from "./app-config-repository";
import Store = require("electron-store");
import { AppConfig } from "./app-config";

export class ElectronStoreAppConfigRepository implements AppConfigRepository {
    private store: Store;
    private configKey = "app-config";
    private defaultAppConfig: AppConfig;

    constructor(defaultAppConfig: AppConfig) {
        this.defaultAppConfig = defaultAppConfig;
        this.store = new Store();
    }

    public getAppConfig(): AppConfig {
        const appConfig = this.store.get(this.configKey);
        return appConfig !== undefined
            ? appConfig
            : this.defaultAppConfig;
    }

    public setAppConfig(newAppConfig: AppConfig): void {
        this.store.set(this.configKey, newAppConfig);
    }
}
