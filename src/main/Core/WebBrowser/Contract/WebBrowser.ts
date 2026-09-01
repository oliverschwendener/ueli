import type { Image } from "@shared/Core/Image";

import type { WebBrowserBookmark } from "./WebBrowserBookmark";

export interface WebBrowser {
    getName(): string;
    getImage(): Image;
    getBookmarks(): Promise<WebBrowserBookmark[]>;
    isSupported(): boolean;
}
