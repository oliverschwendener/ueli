import type { WebBrowserBookmark } from "../../Contract";

export class FirefoxBookmark implements WebBrowserBookmark {
    public constructor(
        private readonly title: string,
        private readonly url: string,
        private readonly guid: string,
    ) {}

    public getName(): string {
        return this.title;
    }

    public getUrl(): string {
        return this.url;
    }

    public getId(): string {
        return this.guid;
    }
}
