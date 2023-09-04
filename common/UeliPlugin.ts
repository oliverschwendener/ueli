import type { OperatingSystem } from "@common/OperatingSystem";

export interface UeliPlugin {
    readonly id: string;
    readonly name: string;
    readonly supportedOperatingSystems: OperatingSystem[];
    addSearchResultItemsToSearchIndex(): Promise<void>;
}
