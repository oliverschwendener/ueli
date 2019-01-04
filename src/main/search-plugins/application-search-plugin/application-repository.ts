import { Application } from "./application";

export interface ApplicationRepository {
    getAll(): Promise<Application[]>;
    refreshIndex(): void;
    clearCache(): Promise<void>
}
