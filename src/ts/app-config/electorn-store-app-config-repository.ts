import { AppConfigRepository } from "./app-config-repository";
import Store = require("electron-store");
import { AppConfig } from "./app-config";

export class ElectronStoreAppConfigRepository implements AppConfigRepository {
    private readonly store: Store;
    private readonly configKey = "app-config";
    private readonly defaultAppConfig: AppConfig;

    constructor(defaultAppConfig: AppConfig) {
        this.defaultAppConfig = defaultAppConfig;
        this.store = new Store();
    }

    public getAppConfig(): AppConfig {
        const appConfig = this.store.get(this.configKey);
        const merged = Object.assign(this.defaultAppConfig, appConfig);
        return merged;
    }

    public setAppConfig(newAppConfig: AppConfig): void {
        this.store.set(this.configKey, newAppConfig);
    }
}
