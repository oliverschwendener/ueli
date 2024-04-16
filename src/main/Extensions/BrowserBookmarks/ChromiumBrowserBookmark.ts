import type { BrowserBookmark } from "./BrowserBookmark";

export class ChromiumBrowserBookmark implements BrowserBookmark {
    public constructor(
        private readonly name: string,
        private readonly url: string,
        private readonly guid: string,
    ) {}

    public getId(): string {
        return `ChromiumBrowserBookmark[${this.guid}]`;
    }

    public getName(): string {
        return this.name;
    }

    public getUrl(): string {
        return this.url;
    }
}
