import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { IniFileParser } from "@Core/IniFileParser/IniFileParser";
import type { Logger } from "@Core/Logger";
import type { Image } from "@common/Core/Image";
import { dirname, extname, join } from "path";
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

export class LinuxIconExtractor implements FileIconExtractor {
    private searchCache: Map<string, IconTheme[]>;
    private userTheme: string;
    private readonly baseDirectories: string[];
    private readonly folderPaths: Record<string, string>;

    public constructor(
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly commandlineUtility: CommandlineUtility,
        private readonly iniFileParser: IniFileParser,
        private readonly logger: Logger,
        private readonly cacheFileNameGenerator: CacheFileNameGenerator,
        private readonly cacheFolder: string,
        private readonly homePath: string,
    ) {
        this.baseDirectories = [
            join(this.homePath, ".icons"),
            join(process.env["XDG_DATA_HOME"] || join(this.homePath, ".local", "share"), "icons"),
            ...(process.env["XDG_DATA_DIRS"] || `${join("/", "usr", "local", "share")}:${join("/", "usr", "share")}`)
                .split(":")
                .map((dir) => join(dir, "icons")),
            join("/", "usr", "share", "pixmaps"),
        ];

        this.folderPaths = {
            [homePath]: "user-home",
            [join(homePath, "Desktop")]: "user-desktop",
            [join(homePath, "Documents")]: "folder-documents",
            [join(homePath, "Downloads")]: "folder-download",
            [join(homePath, "Videos")]: "folder-videos",
            [join(homePath, "Music")]: "folder-music",
            [join(homePath, "Pictures")]: "folder-pictures",
            [join(homePath, "Public")]: "folder-publicshare",
            [join(homePath, "Templates")]: "folder-templates",
            [join(homePath, "Bookmarks")]: "user-bookmarks",
        };
    }

    public matchesFilePath(filePath: string) {
        // TODO: Add AppImage support
        return filePath.endsWith(".desktop") || this.fileSystemUtility.isDirectory(filePath);
    }

    public async extractFileIcon(filePath: string): Promise<Image> {
        const iconName = filePath.endsWith(".desktop")
            ? await this.extractAppIconName(filePath)
            : this.extractFolderIconName(filePath);
        const iconFilePath = await this.ensureCachedIconExists(iconName);
        return { url: `file://${iconFilePath}` };
    }

    public async extractFileIcons(filePaths: string[]): Promise<Record<string, Image>> {
        const promises = filePaths.map((file) => this.extractFileIcon(file));

        const results = await Promise.allSettled(promises);

        const values: Record<string, Image> = {};
        for (let i = 0; i < filePaths.length; i++) {
            const result = results[i];
            if (result.status !== "fulfilled") {
                this.logger.error(result.reason);
                continue;
            }
            values[filePaths[i]] = result.value;
        }
        return values;
    }

    private async extractAppIconName(filePath: string) {
        const appConfig = this.iniFileParser.parseIniFileContent(
            (await this.fileSystemUtility.readFile(filePath)).toString(),
        )["Desktop Entry"];

        if (!appConfig["Icon"]) throw `${filePath} doesn't have an icon!`;
        return appConfig["Icon"];
    }

    private extractFolderIconName(filePath: string) {
        return this.folderPaths[filePath] ?? "folder";
    }

    private async ensureCachedIconExists(iconName: string): Promise<string> {
        const iconFilePath = this.getIconFilePath(iconName);

        const iconFileAlreadyExists = await this.fileSystemUtility.pathExists(iconFilePath);

        if (!iconFileAlreadyExists) {
            await this.generateAppIcon(iconName, iconFilePath);
        }

        return iconFilePath;
    }

    private getIconFilePath(iconName: string): string {
        return `${join(this.cacheFolder, this.cacheFileNameGenerator.generateCacheFileName(iconName))}.png`;
    }

    private async generateAppIcon(iconName: string, iconFilePath: string): Promise<void> {
        if (!this.searchCache || !this.userTheme) await this.generateThemeSearchCache();

        const iconSize = 128;

        const iconPath = this.findIcon(iconName, iconSize, 1, this.userTheme);
        if (!iconPath) throw `Icon ${iconName} could not be found!`;

        return this.saveIcon(iconPath, iconFilePath, iconSize);
    }

    private async generateThemeSearchCache(): Promise<void> {
        try {
            this.searchCache = new Map();
            this.userTheme = await this.getIconThemeName();
            const validThemeDirectories = await this.getExistingThemeDirectories(this.userTheme, this.baseDirectories);

            while (validThemeDirectories.length !== 0) {
                const themeFile = join(validThemeDirectories.pop(), "index.theme");
                if (!this.fileSystemUtility.existsSync(themeFile)) {
                    this.logger.info(`File ${themeFile} doesn't exist!`);
                    continue;
                }
                const themeData = await this.parseThemeIndex(themeFile);
                for (const parent of themeData.parents) {
                    validThemeDirectories.concat(await this.getExistingThemeDirectories(parent, this.baseDirectories));
                }
                const themeName = themeData.name;
                if (!this.searchCache.has(themeName)) this.searchCache.set(themeName, [themeData]);
            }
        } catch (error) {
            // Handle Error
            this.logger.error(`Failed to generate a cache for theme! Reason: ${error}`);
            throw error;
        }
    }

    private async getExistingThemeDirectories(theme: string, searchDirectories: string[]): Promise<string[]> {
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
        const themeIndex = this.iniFileParser.parseIniFileContent(
            (await this.fileSystemUtility.readFile(file)).toString(),
        );
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
                //Default values
                Size: parseInt(themeIndex[dir].Size),
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

    private async saveIcon(source: string, output: string, iconSize: number): Promise<void> {
        extname(source) !== "png"
            ? await this.commandlineUtility.executeCommand(
                  `convert -background none -resize ${iconSize}x ${source} ${output}`,
              )
            : await this.fileSystemUtility.copyFile(source, output);
    }

    private async getIconThemeName(): Promise<string> {
        switch (process.env["XDG_SESSION_DESKTOP"]) {
            case "cinnamon":
                return (
                    await this.commandlineUtility.executeCommand(
                        "gsettings get org.cinnamon.desktop.interface icon-theme",
                    )
                )
                    .trim()
                    .slice(1, -1);
            case "gnome":
                return (
                    await this.commandlineUtility.executeCommand("gsettings get org.gnome.desktop.interface icon-theme")
                )
                    .trim()
                    .slice(1, -1);
            default:
                throw "Desktop environment not supported!";
        }
    }

    // https://specifications.freedesktop.org/icon-theme-spec/latest/ar01s05.html
    public findIcon(icon: string, size: number, scale: number, theme: string): string {
        let fileName = this.findIconHelper(icon, size, scale, theme);
        if (fileName) return fileName;

        fileName = this.findIconHelper(icon, size, scale, "hicolor");
        if (fileName) return fileName;

        return this.lookupFallbackIcon(icon);
    }

    private findIconHelper(icon: string, size: number, scale: number, theme: string): string {
        if (!this.searchCache.has(theme)) return "";
        let fileName = this.lookupIcon(icon, size, scale, theme);
        if (fileName) return fileName;

        for (const themeIndex of this.searchCache.get(theme)) {
            if (themeIndex.parents) {
                for (const parent of themeIndex.parents) {
                    fileName = this.findIconHelper(icon, size, scale, parent);
                    if (fileName) return fileName;
                }
            }
        }
        return "";
    }

    private lookupIcon(iconName: string, size: number, scale: number, theme: string): string {
        for (const themeIndex of this.searchCache.get(theme)) {
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
        for (const themeIndex of this.searchCache.get(theme)) {
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

    private lookupFallbackIcon(iconName: string): string {
        for (const directory of this.baseDirectories) {
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
