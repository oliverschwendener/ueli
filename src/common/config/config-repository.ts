import { UserConfigOptions } from "./user-config-options";

export interface ConfigRepository {
    getConfig(): UserConfigOptions;
    saveConfig(config: UserConfigOptions): Promise<void>;
    openConfigFile(): void;
}
