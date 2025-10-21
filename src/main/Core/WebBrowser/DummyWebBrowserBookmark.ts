import type { WebBrowserBookmark } from "./Contract";

export class DummyWebBrowserBookmark implements WebBrowserBookmark {
    public constructor(
        private readonly name: string = "Dummy Bookmark",
        private readonly url: string = "https://example.com",
        private readonly id: string = "dummy-bookmark-id",
    ) {}

    public getName(): string {
        return this.name;
    }

    public getUrl(): string {
        return this.url;
    }

    public getId(): string {
        return this.id;
    }
}
