import type { Image } from "@Shared/Core/Image";

import type { WebBrowserBookmark } from "./WebBrowserBookmark";

export interface WebBrowser {
    getName(): string;
    getImage(): Image;
    getBookmarks(): Promise<WebBrowserBookmark[]>;
    isSupported(): boolean;
}
