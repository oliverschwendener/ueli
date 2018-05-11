import { ConfigOptions } from "./config-options";

export interface ConfigRepository {
    getConfig(): ConfigOptions;
    saveConfig(): void;
}
