import { ConfigRepository } from "./config-repository";
import { UserConfigOptions } from "./user-config-options";

export class InMemoryConfigRepository implements ConfigRepository {
    private config: UserConfigOptions;

    constructor(config: UserConfigOptions) {
        this.config = config;
    }

    public getConfig(): UserConfigOptions {
        return this.config;
    }

    public async saveConfig(updatedConfig: UserConfigOptions): Promise<void> {
        this.config = updatedConfig;
    }

    public openConfigFile() {
        throw new Error("Not implemented");
    }
}
