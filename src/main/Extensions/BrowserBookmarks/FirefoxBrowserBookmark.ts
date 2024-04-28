import type { BrowserBookmark } from "./BrowserBookmark";

export class FirefoxBrowserBookmark implements BrowserBookmark {
    public constructor(
        private readonly name: string,
        private readonly url: string,
        private readonly id: string,
    ) {}

    public getName(): string {
        return this.name;
    }

    public getUrl(): string {
        return this.url;
    }

    public getId(): string {
        return `FirefoxBrowserBookmark[${this.id}]`;
    }
}
