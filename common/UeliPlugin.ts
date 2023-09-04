import type { OperatingSystem } from "@common/OperatingSystem";

export interface UeliPlugin {
    readonly id: string;
    readonly name: string;
    getSupportedOperatingSystems(): OperatingSystem[];
    addSearchResultItemsToSearchIndex(): Promise<void>;
}
