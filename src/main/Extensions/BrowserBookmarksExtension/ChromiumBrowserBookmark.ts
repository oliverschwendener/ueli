import type { SearchResultItem } from "@common/Core";
import type { BrowserBookmark } from "./BrowserBookmark";

export class ChromiumBrowserBookmark implements BrowserBookmark {
    public constructor(
        private readonly name: string,
        private readonly url: string,
        private readonly guid: string,
        private readonly id: string,
    ) {}

    public toSearchResultItem(searchResultStyle: string): SearchResultItem {
        const nameMap: Record<string, string> = {
            nameOnly: this.name,
            urlOnly: this.url,
            nameAndUrl: `${this.name} - ${this.url}`,
        };

        return {
            description: "Browser Bookmark",
            defaultAction: {
                argument: this.url,
                description: "Open URL in browser",
                handlerId: "Url",
                hideWindowAfterInvocation: true,
                fluentIcon: "OpenRegular",
            },
            id: `BrowserBookmark-${this.guid}-${this.id}`,
            name: nameMap[searchResultStyle],
            imageUrl: `https://favicone.com/${new URL(this.url).host}?s=48`,
        };
    }
}
