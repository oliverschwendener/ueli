import Store = require("electron-store");
import { ConfigRepository } from "./config-repository";
import { UserConfigOptions } from "./user-config-options";

export class ElectronStoreConfigRepository implements ConfigRepository {
    private readonly store: Store;
    private readonly configStoreKey = "user-config-options";

    constructor(defaultUserConfigOptions: UserConfigOptions) {
        this.store = new Store();
        if (this.getConfig() === undefined) {
            this.setDefaultConfig(defaultUserConfigOptions);
        }
    }

    public getConfig(): UserConfigOptions {
        return this.store.get(this.configStoreKey);
    }

    public saveConfig(updatedConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve) => {
            this.store.set(this.configStoreKey, updatedConfig);
            resolve();
        });
    }

    private setDefaultConfig(defaultUserConfigOptions: UserConfigOptions) {
        this.saveConfig(defaultUserConfigOptions);
    }
}
