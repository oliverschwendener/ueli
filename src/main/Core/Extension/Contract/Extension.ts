import type { SearchResultItem } from "@common/Core";
import type { Translations } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";

export interface Extension {
    readonly id: string;
    readonly name: string;

    readonly nameTranslation?: {
        key: string;
        namespace: string;
    };

    readonly author: {
        name: string;
        githubUserName: string;
    };

    getSearchResultItems(): Promise<SearchResultItem[]>;
    isSupported(): boolean;
    getSettingDefaultValue<T>(key: string): T;
    getImage(): Image;
    getTranslations(): Translations;

    getInstantSearchResultItems?(searchTerm: string): SearchResultItem[];
    invoke?(argument: unknown): Promise<unknown>;
    getAssetFilePath?(key: string): string;
    getSettingKeysTriggeringRescan?(): string[];
}
