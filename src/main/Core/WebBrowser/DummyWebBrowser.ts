import type { Image } from "@common/Core/Image";
import type { WebBrowser, WebBrowserBookmark } from "./Contract";
import { DummyWebBrowserBookmark } from "./DummyWebBrowserBookmark";

export class DummyWebBrowser implements WebBrowser {
    public constructor(
        private readonly name: string = "Dummy Web Browser",
        private readonly image: Image = { url: "test url" },
        private readonly bookmarks: WebBrowserBookmark[] = [new DummyWebBrowserBookmark()],
        private readonly supported: boolean = true,
    ) {}

    public getName(): string {
        return this.name;
    }

    public getImage(): Image {
        return this.image;
    }

    public getBookmarks(): Promise<WebBrowserBookmark[]> {
        return Promise.resolve(this.bookmarks);
    }

    public isSupported(): boolean {
        return this.supported;
    }
}
