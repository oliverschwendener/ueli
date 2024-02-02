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

    public toSearchResultItem(searchResultStyle: string, faviconApi: string): SearchResultItem {
        return {
            description: "Browser Bookmark",
            defaultAction: SearchResultItemActionUtility.createOpenUrlSearchResultAction({ url: this.url }),
            id: this.getId(),
            name: this.getName(searchResultStyle),
            imageUrl: this.getImageUrl(faviconApi),
            additionalActions: [
                SearchResultItemActionUtility.createCopyToClipboardAction({
                    textToCopy: this.url,
                    description: "Copy URL to clipboard",
                    descriptionTranslation: {
                        key: "copyUrlToClipboard",
                        namespace: "extension[BrowserBookmarks]",
                    },
                }),
                SearchResultItemActionUtility.createExcludeFromSearchResultsAction({
                    id: this.getId(),
                    name: this.getName(searchResultStyle),
                    imageUrl: this.getImageUrl(faviconApi),
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

    private getImageUrl(faviconApi: string): string {
        const { host } = new URL(this.url);
        const size = 48;

        return faviconApi === "Google"
            ? `https://www.google.com/s2/favicons?domain=${host}&sz=${size}`
            : `https://favicone.com/${host}?s=${size}`;
    }
}
