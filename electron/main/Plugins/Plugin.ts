import type { OperatingSystem } from "@common/OperatingSystem";

export interface Plugin {
    getSupportedOperatingSystems(): OperatingSystem[];
    addSearchResultItemsToSearchIndex(): Promise<void>;
}
