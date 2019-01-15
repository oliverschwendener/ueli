import Store = require("electron-store");
import { ConfigRepository } from "./config-repository";
import { UserConfigOptions } from "./user-config-options";

export class ElectronStoreConfigRepository implements ConfigRepository {
    private readonly store: Store;
    private readonly configStoreKey = "user-config-options";
    private readonly defaultOptions: UserConfigOptions;

    constructor(defaultOptions: UserConfigOptions) {
        this.store = new Store();

        this.defaultOptions = defaultOptions;
        if (this.getConfig() === undefined) {
            this.setDefaultConfig();
        }
    }

    public getConfig(): UserConfigOptions {
        const userOptions = this.store.get(this.configStoreKey);
        return Object.assign(this.defaultOptions, userOptions);
    }

    public saveConfig(updatedConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve) => {
            this.store.set(this.configStoreKey, updatedConfig);
            resolve();
        });
    }

    private setDefaultConfig() {
        this.saveConfig(this.defaultOptions);
    }
}
