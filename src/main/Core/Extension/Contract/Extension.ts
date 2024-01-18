import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { SearchResultItem } from "@common/Core";

export interface Extension {
    readonly id: string;
    readonly name: string;
    readonly nameTranslationKey?: string;

    getSearchResultItems(): Promise<SearchResultItem[]>;
    isSupported(dependencyRegistry: DependencyRegistry<Dependencies>): boolean;
    getSettingDefaultValue<T>(key: string): T;
    invoke?(argument: unknown): Promise<unknown>;
    getImageUrl?(): string;
    getSettingKeysTriggeringReindex?: () => string[];
}
