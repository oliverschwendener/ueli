import type { BrowserBookmark } from "./BrowserBookmark";

export class ChromiumBrowserBookmark implements BrowserBookmark {
    public constructor(
        private readonly name: string,
        private readonly url: string,
        private readonly guid: string,
        private readonly id: string,
    ) {}

    public getId(): string {
        return `BrowserBookmark[Chromium]-${this.guid}-${this.id}`;
    }

    public getName(): string {
        return this.name;
    }

    public getUrl(): string {
        return this.url;
    }
}
