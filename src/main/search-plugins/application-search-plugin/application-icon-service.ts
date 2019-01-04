import { Application } from "./application";

export interface ApplicationIconService {
    getIcon(applicaton: Application): Promise<string>;
    clearCache(): Promise<void>
}
