import { Application } from "./application";
import { ApplicationSearchOptions } from "../../../common/config/application-search-options";

export interface ApplicationRepository {
    getAll(): Promise<Application[]>;
    refreshIndex(): Promise<void>;
    clearCache(): Promise<void>;
    updateConfig(updatedConfig: ApplicationSearchOptions): Promise<void>;
}
