import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { IniFileParser } from "@Core/IniFileParser";
import type { OperatingSystem } from "@common/Core";
import type { App } from "electron";
import { join } from "path";

export class FirefoxBookmarkFilePathResolver {
    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly app: App,
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly iniFileParser: IniFileParser,
    ) {}

    public getSqliteFilePath(): string {
        return join(this.getAppDataFilePath(), this.getRelativeProfilePath(), "places.sqlite");
    }

    private getAppDataFilePath(): string {
        const map: Record<OperatingSystem, () => string> = {
            Linux: () => {
                throw new Error("Linux is not supported by Firefox.");
            },
            macOS: () => join(this.app.getPath("appData"), "Firefox"),
            Windows: () => join(this.app.getPath("home"), "AppData", "Roaming", "Mozilla", "Firefox"),
        };

        return map[this.operatingSystem]();
    }

    private getRelativeProfilePath(): string {
        const iniFileContent = this.fileSystemUtility.readTextFileSync(join(this.getAppDataFilePath(), "profiles.ini"));
        const ini = this.iniFileParser.parseIniFileContent(iniFileContent);

        for (const key of Object.keys(ini)) {
            if (key === "Profile0") {
                return ini[key]["Path"];
            }
        }

        throw new Error("Unable to get default profile from profiles.ini");
    }
}
