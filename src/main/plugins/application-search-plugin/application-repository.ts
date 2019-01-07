import { Application } from "./application";

export interface ApplicationRepository {
    getAll(): Promise<Application[]>;
    refreshIndex(): Promise<void>;
    clearCache(): Promise<void>;
}
