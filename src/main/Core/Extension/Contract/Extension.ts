import type { SearchResultItem } from "@common/Core";
import type { DependencyRegistry } from "../../DependencyRegistry";

export interface Extension {
    readonly id: string;
    readonly name: string;
    readonly nameTranslationKey?: string;
    readonly settingKeysTriggerindReindex?: string[];

    getSearchResultItems(): Promise<SearchResultItem[]>;
    isSupported(dependencyRegistry: DependencyRegistry): boolean;
    getSettingDefaultValue<T>(key: string): T;
    invoke?(argument: unknown): Promise<unknown>;
    getImageUrl?(): string;
}
