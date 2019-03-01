import Store = require("electron-store");
import { ConfigRepository } from "./config-repository";
import { UserConfigOptions } from "./user-config-options";
import { cloneDeep } from "lodash";

export class ElectronStoreConfigRepository implements ConfigRepository {
    private readonly store: Store;
    private readonly configStoreKey = "userConfigOptions";
    private readonly defaultOptions: UserConfigOptions;

    constructor(defaultOptions: UserConfigOptions) {
        this.store = new Store();
        this.defaultOptions = defaultOptions;
    }

    public getConfig(): UserConfigOptions {
        const userConfig = this.store.get(this.configStoreKey);
        const result: any = cloneDeep(this.defaultOptions);

        Object.keys(this.defaultOptions).forEach((key: string) => {
            const merged = userConfig !== undefined && userConfig.hasOwnProperty(key)
                ? Object.assign(result[key], userConfig[key])
                : result[key];
            result[key] = merged;
        });

        return result;
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
