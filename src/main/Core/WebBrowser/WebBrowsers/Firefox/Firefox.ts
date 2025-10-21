import type { OperatingSystem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import Database from "better-sqlite3";
import type { WebBrowser, WebBrowserBookmark } from "../../Contract";
import type { FirefoxBookmarkFilePathResolver } from "../../Utility";
import type { DatabaseRow } from "./DatabaseRow";
import { FirefoxBookmark } from "./FirefoxBookmark";

export class Firefox implements WebBrowser {
    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly bookmarkFilePathResolver: FirefoxBookmarkFilePathResolver,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public getName(): string {
        return "Firefox";
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getModuleAssetPath("WebBrowser", "firefox.png")}`,
        };
    }

    public async getBookmarks(): Promise<WebBrowserBookmark[]> {
        const database = new Database(this.bookmarkFilePathResolver.getSqliteFilePath(), { readonly: true });

        try {
            return database
                .prepare<unknown[], DatabaseRow>(
                    `SELECT
                        b.title,
                        b.guid,
                        p.url
                    FROM moz_bookmarks b
                        JOIN moz_places p ON b.fk = p.id
                    WHERE b.type = 1`,
                )
                .all()
                .map(({ guid, title, url }) => new FirefoxBookmark(title, url, guid));
        } finally {
            database.close();
        }
    }

    public isSupported(): boolean {
        return this.operatingSystem === "Windows" || this.operatingSystem === "macOS";
    }
}
