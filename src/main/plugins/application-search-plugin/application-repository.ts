import { Application } from "./application";
import { ApplicationSearchPluginOptions } from "./application-search-plugin-options";

export interface ApplicationRepository {
    getAll(): Promise<Application[]>;
    refreshIndex(): Promise<void>;
    clearCache(): Promise<void>;
    updateConfig(updatedConfig: ApplicationSearchPluginOptions): Promise<void>;
}
