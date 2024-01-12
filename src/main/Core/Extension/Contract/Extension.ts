import type { SearchResultItem } from "@common/SearchResultItem";
import type { DependencyInjector } from "../../DependencyInjector";

export interface Extension {
    readonly id: string;
    readonly name: string;
    readonly nameTranslationKey?: string;
    getSearchResultItems(): Promise<SearchResultItem[]>;
    isSupported(dependencyInjector: DependencyInjector): boolean;
    getSettingDefaultValue<T>(key: string): T;
    invoke?(argument: unknown): Promise<unknown>;
    getImageUrl?(): string;
}
