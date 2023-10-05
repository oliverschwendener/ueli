import type { Application } from "./Application";

export interface ApplicationRepository {
    getApplications(pluginId: string): Promise<Application[]>;
}
