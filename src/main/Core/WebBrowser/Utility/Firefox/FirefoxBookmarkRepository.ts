import type { OperatingSystem } from "@common/Core";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { IniFileParser } from "@Core/IniFileParser";
import Database from "better-sqlite3";
import type { App } from "electron";
import { join } from "path";
import type { DatabaseRow } from "./DatabaseRow";
import { FirefoxBookmark } from "./FirefoxBookmark";

export class FirefoxBookmarkRepository {
    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly app: App,
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly iniFileParser: IniFileParser,
    ) {}

    public getAll(browserName: string): FirefoxBookmark[] {
        const database = new Database(this.getSqliteFilePath(browserName), {
            readonly: true,
        });

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

    private getAppDataPath(browserName: string): string {
        const map: Record<string, Record<OperatingSystem, () => string>> = {
            Firefox: {
                Linux: () => {
                    throw new Error("Linux is not supported by Firefox.");
                },
                macOS: () => join(this.app.getPath("appData"), "Firefox"),
                Windows: () => join(this.app.getPath("home"), "AppData", "Roaming", "Mozilla", "Firefox"),
            },
            Zen: {
                Linux: () => {
                    throw new Error("Linux is not supported by Zen.");
                },
                macOS: () => join(this.app.getPath("appData"), "Zen"),
                Windows: () => join(this.app.getPath("home"), "AppData", "Roaming", "Zen"),
            },
        };

        const browserMap = map[browserName];

        if (!browserMap) {
            throw new Error(`Unable to resolve app data path for Firefox-based browser: ${browserName}`);
        }

        return browserMap[this.operatingSystem]();
    }

    private getSqliteFilePath(browserName: string): string {
        const appDataPath = this.getAppDataPath(browserName);
        return join(appDataPath, this.getRelativeProfilePath(appDataPath), "places.sqlite");
    }

    private getRelativeProfilePath(appDataPath: string): string {
        const iniFileContent = this.fileSystemUtility.readTextFileSync(join(appDataPath, "profiles.ini"));
        const ini = this.iniFileParser.parseIniFileContent(iniFileContent);

        for (const key of Object.keys(ini)) {
            if (key === "Profile0") {
                return ini[key]["Path"];
            }
        }

        throw new Error("Unable to get default profile from profiles.ini");
    }
}
