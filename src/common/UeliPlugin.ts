import type { DependencyInjector } from "./DependencyInjector";
import type { SearchResultItem } from "./SearchResultItem";

export interface UeliPlugin {
    readonly id: string;
    readonly name: string;
    readonly nameTranslationKey?: string;
    getSearchResultItems(): Promise<SearchResultItem[]>;
    isSupported(dependencyInjector: DependencyInjector): boolean;
}
