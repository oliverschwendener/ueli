import Database from "better-sqlite3";
import type { BrowserBookmark } from "./BrowserBookmark";
import type { BrowserBookmarkRepository } from "./BrowserBookmarkRepository";
import { FirefoxBrowserBookmark } from "./FirefoxBrowserBookmark";

export class FirefoxBrowserBookmarkRepository implements BrowserBookmarkRepository {
    public constructor(private readonly sqliteFilePathResolver: () => string) {}

    public async getAll(): Promise<BrowserBookmark[]> {
        const rows = new Database(this.sqliteFilePathResolver())
            .prepare(
                `SELECT
                    b.title,
                    b.guid,
                    p.url
                FROM moz_bookmarks b
                    JOIN moz_places p ON b.fk = p.id
                WHERE b.type = 1`,
            )
            .all() as { title: string; guid: string; url: string }[];

        return rows.map(({ guid, title, url }) => new FirefoxBrowserBookmark(title, url, guid));
    }
}
