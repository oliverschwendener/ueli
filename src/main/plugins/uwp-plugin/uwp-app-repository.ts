import { UwpApplication } from "./uwp-application";

export interface UwpAppRepository {
    getAll(): Promise<UwpApplication[]>;
}
