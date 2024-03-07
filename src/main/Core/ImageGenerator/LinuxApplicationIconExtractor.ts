import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import { extname, join } from "path";
import type { CacheFileNameGenerator } from "./CacheFileNameGenerator";
import type { FileIconExtractor } from "./FileIconExtractor";

// Specs from https://specifications.freedesktop.org/icon-theme-spec/icon-theme-spec-latest.html
interface IconThemeSubdir {
    Size: number;

    Scale: number; // Defaults to 1
    MinSize: number; // Defaults to size
    MaxSize: number; // Defaults to size
    Threshold: number; // Defaults to 2
    Type: "Fixed" | "Scalable" | "Threshold"; // Defaults to Threshold
}

interface IconTheme {
    name: string;
    path: string;
    // Paths in order as listed in index.theme
    subdirectories: string[];
    // Map<subdirPath, subdirData>
    subdirData: Map<string, IconThemeSubdir>;
    parents: string[];
}

interface IconSearchCache {
    // Map<themeName, IconTheme[]>
    themeData: Map<string, IconTheme[]>;
    baseDirectories: string[];
}

export class LinuxApplicationIconExtractor implements FileIconExtractor {
    private themeCache: IconSearchCache = {
        themeData: new Map(),
        baseDirectories: [],
    };
    private theme: string;
    public constructor(
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly commandlineUtility: CommandlineUtility,
        private readonly cacheFileNameGenerator: CacheFileNameGenerator,
        private readonly cacheFolder: string,
    ) {}

    public matches(filePath: string) {
        // TODO: Add AppImage support
        return filePath.endsWith(".desktop");
    }

    public async extractFileIcon(filePath: string): Promise<Image> {
        const iconFilePath = await this.ensureCachedIconExists(applicationFilePath);
        return { url: `file://${iconFilePath}` };
    }

    public async extractFileIcons(filePaths: string[]): Promise<Record<string, Image>> {
        //TODO
        await this.generateThemeSearchCache();
    }

    private async ensureCachedIconExists(applicationFilePath: string): Promise<string> {
        const iconFilePath = this.getIconFilePath(applicationFilePath);

        const iconFileAlreadyExists = await this.fileSystemUtility.pathExists(iconFilePath);

        if (!iconFileAlreadyExists) {
            await this.generateAppIcon(applicationFilePath, iconFilePath);
        }

        return iconFilePath;
    }

    private getIconFilePath(applicationFilePath: string): string {
        return `${join(this.cacheFolder, this.cacheFileNameGenerator.generateCacheFileName(applicationFilePath))}.png`;
    }

    private async generateAppIcon(applicationFilePath: string, iconFilePath: string): Promise<void> {
        const config: Record<string, string> = this.fileSystemUtility.readIniFileSync(applicationFilePath)["Desktop Entry"];
        // Checks if app is supposed to be shown, returns null if not
        // https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html#recognized-keys
        const desktopEnv = process.env["XDG_CURRENT_DESKTOP"].split(":") || ["GNOME"];
        if (
            !config ||
            !config["Icon"] ||
            config.NoDisplay ||
            (config.OnlyShowIn !== undefined && !config.OnlyShowIn.split(";").some((i) => desktopEnv.includes(i))) ||
            (config.NotShowIn !== undefined && config.NotShowIn.split(";").some((i) => desktopEnv.includes(i)))
        )
            return;

        if (!config["Icon"]) return;
        const iconPath = this.findIcon(config["Icon"], 64, 1);

        return this.saveIcon(src, iconFilePath);
    }

    private async generateThemeSearchCache(): Promise<void> {
        try {
            const baseDirectories = [
                join(this.app.getPath("home"), ".icons"),
                join(process.env["XDG_DATA_HOME"] || join(this.app.getPath("home"), ".local", "share"), "icons"),
                ...(
                    process.env["XDG_DATA_DIRS"] || `${join("/", "usr", "local", "share")}:${join("/", "usr", "share")}`
                )
                    .split(":")
                    .map((dir) => join(dir, "icons")),
                join("/", "usr", "share", "pixmaps"),
            ];

            const themeName = await this.getIconThemeName();
            const validThemeDirectories = await this.getValidThemeDirectories(themeName, baseDirectories);

            while (validThemeDirectories.length !== 0) {
                const themeFile = join(validThemeDirectories.pop(), "index.theme");
                if (!this.fileSystemUtility.existsSync(themeFile)) {
                    this.logger.info(`File ${themeFile} doesn't exist!`);
                    continue;
                }
                const themeData = await this.parseThemeIndex(themeFile);
                for (const parent of themeData.parents) {
                    validThemeDirectories.concat(await this.getValidThemeDirectories(parent, baseDirectories));
                }
                const themeName = themeData.name;
                if (!this.themeCache.themeData.has(themeName)) this.themeCache.themeData.set(themeName, []);
                this.themeCache.themeData.get(themeName).push(themeData);
            }
        } catch (error) {
            // Handle Error
        }
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

    private async saveIcon(source: string, output: string): Promise<void> {
        return extname(source) !== "png"
            ? await this.commandlineUtility.executeCommand(`convert -background none -resize 48x ${source} ${output}`)
            : await this.fileSystemUtility.copyFile(source, output);
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

    // https://specifications.freedesktop.org/icon-theme-spec/latest/ar01s05.html
    public findIcon(icon: string, size: number, scale: number, theme: string, cache: IconSearchCache): string {
        let fileName = this.findIconHelper(icon, size, scale, theme, cache);
        if (fileName) return fileName;

        fileName = this.findIconHelper(icon, size, scale, "hicolor", cache);
        if (fileName) return fileName;

        return this.lookupFallbackIcon(icon, cache);
    }

    private findIconHelper(icon: string, size: number, scale: number, theme: string, cache: IconSearchCache): string {
        if (!cache.themeData.has(theme)) return "";
        let fileName = this.lookupIcon(icon, size, scale, theme, cache);
        if (fileName) return fileName;

        for (const themeIndex of cache.themeData.get(theme)) {
            if (themeIndex.parents) {
                for (const parent of themeIndex.parents) {
                    fileName = this.findIconHelper(icon, size, scale, parent, cache);
                    if (fileName) return fileName;
                }
            }
        }
        return "";
    }

    private lookupIcon(iconName: string, size: number, scale: number, theme: string, cache: IconSearchCache): string {
        for (const themeIndex of cache.themeData.get(theme)) {
            for (const subdir of themeIndex.subdirectories) {
                for (const extension of ["png", "svg", "xpm"]) {
                    if (
                        themeIndex.subdirData.has(subdir) &&
                        this.directoryMatchesSize(themeIndex.subdirData.get(subdir), size, scale)
                    ) {
                        const filename = `${join(themeIndex.path, subdir, iconName)}.${extension}`;
                        if (this.fileSystemUtility.existsSync(filename)) return filename;
                    }
                }
            }
        }
        let minimalSize = Number.MAX_SAFE_INTEGER;
        let closestFilename = "";
        for (const themeIndex of cache.themeData.get(theme)) {
            for (const subdir of themeIndex.subdirectories) {
                for (const extension of ["png", "svg", "xpm"]) {
                    if (!themeIndex.subdirData.has(subdir)) continue;
                    const filename = `${join(themeIndex.path, subdir, iconName)}.${extension}`;
                    const dist = this.directorySizeDistance(themeIndex.subdirData.get(subdir), size, scale);
                    if (this.fileSystemUtility.existsSync(filename) && dist < minimalSize) {
                        closestFilename = filename;
                        minimalSize = dist;
                    }
                }
            }
        }
        return closestFilename;
    }

    private lookupFallbackIcon(iconName: string, cache: IconSearchCache): string {
        for (const directory of cache.baseDirectories) {
            for (const extension of ["png", "svg", "xpm"]) {
                const fileName = `${join(directory, iconName)}.${extension}`;
                if (this.fileSystemUtility.existsSync(fileName)) return fileName;
            }
        }
        if (this.fileSystemUtility.existsSync(iconName)) return iconName;
        return "";
    }

    private directorySizeDistance(
        { Type, MaxSize, MinSize, Scale, Size, Threshold }: IconThemeSubdir,
        iconSize: number,
        iconScale: number,
    ): number {
        if (Type === "Fixed") return Math.abs(Size * Scale - iconSize * iconScale);

        if (Type === "Scalable") {
            if (iconSize * iconScale < MinSize * Scale) return MinSize * Scale - iconSize * iconScale;
            if (iconSize * iconScale > MaxSize * Scale) return iconSize * iconScale - MaxSize * Scale;
            return 0;
        }

        if (Type === "Threshold") {
            if (iconSize * iconScale < (Size - Threshold) * Scale) return MinSize * Scale - iconSize * iconScale;
            if (iconSize * iconSize > (Size + Threshold) * Scale) return iconSize * iconSize - MaxSize * Scale;
            return 0;
        }
    }

    private directoryMatchesSize(subdir: IconThemeSubdir, iconSize: number, iconScale: number): boolean {
        if (subdir.Scale !== iconScale) return false;

        if (subdir.Type === "Fixed") return subdir.Size === iconSize;

        if (subdir.Type === "Scalable") return subdir.MinSize <= iconSize && iconSize <= subdir.MaxSize;

        if (subdir.Type === "Threshold")
            return subdir.Size - subdir.Threshold <= iconSize && iconSize <= subdir.Size + subdir.Threshold;
    }
}
