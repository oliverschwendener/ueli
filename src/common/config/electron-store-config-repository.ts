import Store = require("electron-store");
import { ConfigRepository } from "./config-repository";
import { UserConfigOptions } from "./user-config-options";
import { merge } from "lodash";

export class ElectronStoreConfigRepository implements ConfigRepository {
    private readonly store: Store;
    private readonly configStoreKey = "userConfigOptions";
    private readonly defaultOptions: UserConfigOptions;

    constructor(defaultOptions: UserConfigOptions) {
        this.store = new Store();
        this.defaultOptions = defaultOptions;
    }

    public getConfig(): UserConfigOptions {
        return merge(this.defaultOptions, this.store.get(this.configStoreKey));
    }

    public saveConfig(updatedConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve) => {
            this.store.set(this.configStoreKey, updatedConfig);
            resolve();
        });
    }

    public openConfigFile() {
        this.store.openInEditor();
    }
}
