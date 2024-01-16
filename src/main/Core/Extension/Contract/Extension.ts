import type { SearchResultItem } from "@common/Core";
import type { DependencyInjector } from "../../DependencyInjector";

export interface Extension {
    readonly id: string;
    readonly name: string;
    readonly nameTranslationKey?: string;
    readonly settingKeysTriggerindReindex?: string[];

    getSearchResultItems(): Promise<SearchResultItem[]>;
    isSupported(dependencyInjector: DependencyInjector): boolean;
    getSettingDefaultValue<T>(key: string): T;
    invoke?(argument: unknown): Promise<unknown>;
    getImageUrl?(): string;
}
