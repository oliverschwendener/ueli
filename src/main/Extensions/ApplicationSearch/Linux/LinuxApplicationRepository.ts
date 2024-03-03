import { CommandlineUtility } from "@Core/CommandlineUtility";
import { FileSystemUtility } from "@Core/FileSystemUtility";
import { Logger } from "@Core/Logger";
import { dirname, join } from "path";
import { Application } from "../Application";
import { ApplicationRepository } from "../ApplicationRepository";
import type { Settings } from "../Settings";
import type {
    IconSearchCache,
    IconTheme,
    IconThemeSubdir,
    LinuxApplicationIconGenerator,
} from "./LinuxApplicationIconGenerator";

export class LinuxApplicationRepository implements ApplicationRepository {
    public constructor(
        private readonly commandlineUtility: CommandlineUtility,
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly linuxApplicationIconGenerator: LinuxApplicationIconGenerator,
        private readonly logger: Logger,
        private readonly settings: Settings,
    ) {}

    public async getApplications(): Promise<Application[]> {
        try {
            // Build iconSearchCache
            const appFolders = this.settings.getValue<string[]>("linuxApplicationFolders");
            const appExtensions = this.settings.getValue<string[]>("linuxFileExtensions");
            const searchDirectories = this.settings.getValue<string[]>("linuxBaseSearchDirectories");

            if (appFolders.length === 0 || appExtensions.length === 0) return [];

            const themeName = await this.getIconThemeName();
            const validThemeDirectories = await this.getValidThemeDirectories(themeName, searchDirectories);

            const searchCache: IconSearchCache = {
                baseDirectories: searchDirectories,
                themeData: new Map(),
            };

            // themeData
            while (validThemeDirectories.length !== 0) {
                const themeFile = join(validThemeDirectories.pop(), "index.theme");
                if (!this.fileSystemUtility.existsSync(themeFile)) {
                    this.logger.info(`File ${themeFile} doesn't exist!`);
                    continue;
                }
                const themeData = await this.parseThemeIndex(themeFile);
                for (const parent of themeData.parents) {
                    validThemeDirectories.concat(await this.getValidThemeDirectories(parent, searchDirectories));
                }
                const themeName = themeData.name;
                if (!searchCache.themeData.has(themeName)) searchCache.themeData.set(themeName, []);
                searchCache.themeData.get(themeName).push(themeData);
            }
            return (
                await Promise.allSettled(
                    // Finds all application files
                    (
                        await this.commandlineUtility.executeCommandWithOutput(
                            `find ${appFolders.join(" ")} -type f -name "*${appExtensions.join('" -o -name "')}"`,
                            true,
                            true,
                        )
                    )
                        .split("\n")
                        .filter((t) => t)
                        .map(async (filePath) => {
                            try {
                                const config: Record<string, string> =
                                    this.fileSystemUtility.readIniFileSync(filePath)["Desktop Entry"];
                                // Checks if app is supposed to be shown, returns null if not
                                // https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html#recognized-keys
                                const desktopEnv = process.env["XDG_CURRENT_DESKTOP"].split(":") || ["GNOME"];
                                if (
                                    !config ||
                                    !config["Icon"] ||
                                    config.NoDisplay ||
                                    (config.OnlyShowIn !== undefined &&
                                        !config.OnlyShowIn.split(";").some((i) => desktopEnv.includes(i))) ||
                                    (config.NotShowIn !== undefined &&
                                        config.NotShowIn.split(";").some((i) => desktopEnv.includes(i)))
                                )
                                    return null;

                                const iconFilePath = await this.linuxApplicationIconGenerator.getApplicationIcon(
                                    config["Icon"],
                                    themeName,
                                    searchCache,
                                );
                                return iconFilePath
                                    ? new Application(config["Name"], filePath, `file://${iconFilePath}`)
                                    : null;
                            } catch (error) {
                                console.log(filePath);
                                console.error(error);
                                throw error;
                            }
                        }),
                )
            )
                .filter((promise) => {
                    if (promise.status === "rejected") {
                        this.logger.error(promise.reason);
                        return false;
                    }
                    if (promise.value === null) return false;

                    return true;
                })
                .map((promise: PromiseFulfilledResult<Application>) => promise.value);
        } catch (error) {
            console.error(`Error in getApplication! Error: ${error}`);
        }
    }

    private async getIconThemeName(): Promise<string> {
        switch (process.env["XDG_SESSION_DESKTOP"]) {
            case "cinnamon":
                return (
                    await this.commandlineUtility.executeCommandWithOutput(
                        "gsettings get org.cinnamon.desktop.interface icon-theme",
                    )
                )
                    .trim()
                    .slice(1, -1);
            case "gnome":
                return (
                    await this.commandlineUtility.executeCommandWithOutput(
                        "gsettings get org.gnome.desktop.interface icon-theme",
                    )
                )
                    .trim()
                    .slice(1, -1);
            default:
                throw "Desktop environment not supported!";
        }
    }

    // https://specifications.freedesktop.org/icon-theme-spec/latest/ar01s04.html
    private async parseThemeIndex(file: string): Promise<IconTheme> {
        const themeIndex = await this.fileSystemUtility.readIniFile(file);
        const iconThemeData: Record<string, string> = themeIndex["Icon Theme"];
        const subdirectories: string[] = [];
        const subdirData = new Map<string, IconThemeSubdir>();
        for (const dir of iconThemeData["Directories"].split(",")) {
            subdirectories.push(dir);

            if (!themeIndex[dir]) {
                // Fake folders
                this.logger.error(`Theme index ${file} is invalid! Group ${dir} doesn't exist!`);
                continue;
            }

            // Required Value
            if (!themeIndex[dir].Size) {
                // Apparently some themes don't have size
                this.logger.error(`Theme index ${file} is invalid! Size key does not exist in group ${dir}!`);
                themeIndex[dir].Size = "0";
            }

            const subdir: IconThemeSubdir = {
                Size: parseInt(themeIndex[dir].Size),
                //Default values
                Type: "Threshold",
                Scale: 1,
                MinSize: parseInt(themeIndex[dir].Size),
                MaxSize: parseInt(themeIndex[dir].Size),
                Threshold: 2,
            };

            subdirData.set(dir, subdir);
        }

        return {
            name: iconThemeData["Name"],
            path: dirname(file),
            subdirectories,
            subdirData,
            parents: iconThemeData["Inherits"].split(","),
        };
    }

    private async getValidThemeDirectories(theme: string, searchDirectories: string[]): Promise<string[]> {
        return (
            await Promise.allSettled(
                searchDirectories.map(async (dir) =>
                    (await this.fileSystemUtility.pathExists(`${join(dir, theme, "index.theme")}`))
                        ? `${join(dir, theme)}`
                        : "",
                ),
            )
        )
            .filter((promise) => promise.status === "fulfilled" && promise.value)
            .map((v) => (v.status === "fulfilled" ? v.value : ""));
    }
}
