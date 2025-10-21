import type { WebBrowserBookmark } from "../../Contract";

export class ChromiumBrowserBookmark implements WebBrowserBookmark {
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
        return this.id;
    }
}
