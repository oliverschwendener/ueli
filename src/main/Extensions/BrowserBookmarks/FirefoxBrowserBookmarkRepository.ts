import Database from "better-sqlite3";
import type { BrowserBookmark } from "./BrowserBookmark";
import type { BrowserBookmarkRepository } from "./BrowserBookmarkRepository";
import type { FirefoxBookmarkFileResolver } from "./FirefoxBookmarkFileResolver";
import { FirefoxBrowserBookmark } from "./FirefoxBrowserBookmark";

type DatabaseRow = {
    title: string;
    guid: string;
    url: string;
};

export class FirefoxBrowserBookmarkRepository implements BrowserBookmarkRepository {
    public constructor(private readonly bookmarkFilePathResolver: FirefoxBookmarkFileResolver) {}

    public async getAll(): Promise<BrowserBookmark[]> {
        const database = new Database(this.bookmarkFilePathResolver.getSqliteFilePath(), { readonly: true });

        try {
            const rows = database
                .prepare<unknown[], DatabaseRow>(
                    `SELECT
                        b.title,
                        b.guid,
                        p.url
                    FROM moz_bookmarks b
                        JOIN moz_places p ON b.fk = p.id
                    WHERE b.type = 1`,
                )
                .all();

            return rows.map(({ guid, title, url }) => new FirefoxBrowserBookmark(title, url, guid));
        } finally {
            database.close();
        }
    }
}
