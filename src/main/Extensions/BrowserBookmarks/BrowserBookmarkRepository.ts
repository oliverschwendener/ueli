import type { BrowserBookmark } from "./BrowserBookmark";

export interface BrowserBookmarkRepository {
    getAll(): Promise<BrowserBookmark[]>;
}
