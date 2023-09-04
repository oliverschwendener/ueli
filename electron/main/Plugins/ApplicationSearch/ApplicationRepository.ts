import type { Application } from "./Application";

export interface ApplicationRepository {
    getApplications(): Promise<Application[]>;
}
