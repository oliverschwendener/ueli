import type { OperatingSystem } from "./OperatingSystem";
import type { SearchResultItem } from "./SearchResultItem";

export interface UeliPlugin {
    readonly id: string;
    readonly name: string;
    readonly nameTranslationKey?: string;
    readonly supportedOperatingSystems: OperatingSystem[];
    getSearchResultItems(): Promise<SearchResultItem[]>;
}
