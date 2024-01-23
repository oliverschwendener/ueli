import type { SearchResultItem } from "@common/Core";

export interface Extension {
    readonly id: string;
    readonly name: string;
    readonly nameTranslationKey?: string;

    getSearchResultItems(): Promise<SearchResultItem[]>;
    isSupported(): boolean;
    getSettingDefaultValue<T>(key: string): T;
    invoke?(argument: unknown): Promise<unknown>;
    getImageUrl?(): string;
    getSettingKeysTriggeringReindex?(): string[];
}
