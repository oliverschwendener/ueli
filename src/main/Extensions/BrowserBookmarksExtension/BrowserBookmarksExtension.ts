import type { Extension } from "@Core/Extension";
import type { SearchResultItem } from "@common/Core";
import type { BrowserBookmarkRepository } from "./BrowserBookmarkRepository";

export class BrowserBookmarksExtension implements Extension {
    public readonly id = "BrowserBookmarks";
    public readonly name = "Browser Bookmarks";

    public constructor(private readonly browserBookmarkRepository: BrowserBookmarkRepository) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return (await this.browserBookmarkRepository.getAll()).map((browserBookmark) =>
            browserBookmark.toSearchResultItem(),
        );
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(): T {
        return undefined;
    }
}
