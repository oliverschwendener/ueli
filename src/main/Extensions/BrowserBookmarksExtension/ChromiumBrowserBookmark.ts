import type { SearchResultItem } from "@common/Core";
import { SearchResultItemActionUtility } from "@common/Core";
import type { BrowserBookmark } from "./BrowserBookmark";

export class ChromiumBrowserBookmark implements BrowserBookmark {
    public constructor(
        private readonly name: string,
        private readonly url: string,
        private readonly guid: string,
        private readonly id: string,
    ) {}

    public toSearchResultItem(searchResultStyle: string): SearchResultItem {
        return {
            description: "Browser Bookmark",
            defaultAction: SearchResultItemActionUtility.createOpenUrlSearchResultAction({ url: this.url }),
            id: this.getId(),
            name: this.getName(searchResultStyle),
            imageUrl: this.getImageUrl(),
            additionalActions: [
                SearchResultItemActionUtility.createCopyToClipboardAction({
                    textToCopy: this.url,
                    description: "Copy URL to clipboard",
                    descriptionTranslationKey:
                        "extension[BrowserBookmarks].searchResultItem.additionalAction.copyUrlToClipboard",
                }),
                SearchResultItemActionUtility.createExcludeFromSearchResultsAction({
                    id: this.getId(),
                    name: this.getName(searchResultStyle),
                    imageUrl: this.getImageUrl(),
                }),
            ],
        };
    }

    private getId(): string {
        return `BrowserBookmark-${this.guid}-${this.id}`;
    }
    private getName(searchResultStyle: string): string {
        const nameMap: Record<string, string> = {
            nameOnly: this.name,
            urlOnly: this.url,
            nameAndUrl: `${this.name} - ${this.url}`,
        };

        return nameMap[searchResultStyle];
    }

    private getImageUrl(): string {
        return `https://favicone.com/${new URL(this.url).host}?s=48`;
    }
}
