import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { ExtensionCacheFolder } from "@Core/ExtensionCacheFolder";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import { Logger } from "@Core/Logger";
import { basename, extname, join } from "path";

// Specs from https://specifications.freedesktop.org/icon-theme-spec/icon-theme-spec-latest.html
export interface IconThemeSubdir {
    Size: number;

    Scale: number; // Defaults to 1
    MinSize: number; // Defaults to size
    MaxSize: number; // Defaults to size
    Threshold: number; // Defaults to 2
    Type: "Fixed" | "Scalable" | "Threshold"; // Defaults to Threshold
}

export interface IconTheme {
    name: string;
    path: string;
    // Paths in order as listed in index.theme
    subdirectories: string[];
    // Map<subdirPath, subdirData>
    subdirData: Map<string, IconThemeSubdir>;
    parents: string[];
}

export interface IconSearchCache {
    // Map<themeName, IconTheme[]>
    themeData: Map<string, IconTheme[]>;
    baseDirectories: string[];
}

export class LinuxApplicationIconGenerator {
    public constructor(
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly commandlineUtility: CommandlineUtility,
        private readonly logger: Logger,
        private readonly extensionCacheFolder: ExtensionCacheFolder,
    ) {}

    public async getApplicationIcon(iconName: string, theme: string, cache: IconSearchCache): Promise<string> {
        if (this.fileSystemUtility.existsSync(this.getCachePath(iconName))) return this.getCachePath(iconName);

        console.debug(`Generating ${iconName}`);
        const iconPath = this.findIcon(iconName, 64, 1, theme, cache); // Icons at 64px size and 1x scale
        if (!iconPath) {
            console.error(`Failed to find icon ${iconName}`);
            return "";
        }

        return this.saveIcon(iconPath, this.getCachePath(iconName));
    }

    // https://specifications.freedesktop.org/icon-theme-spec/latest/ar01s05.html
    private findIcon(icon: string, size: number, scale: number, theme: string, cache: IconSearchCache): string {
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

    // Solid
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
    // Solid
    private directoryMatchesSize(subdir: IconThemeSubdir, iconSize: number, iconScale: number): boolean {
        if (subdir.Scale !== iconScale) return false;

        if (subdir.Type === "Fixed") return subdir.Size === iconSize;

        if (subdir.Type === "Scalable") return subdir.MinSize <= iconSize && iconSize <= subdir.MaxSize;

        if (subdir.Type === "Threshold")
            return subdir.Size - subdir.Threshold <= iconSize && iconSize <= subdir.Size + subdir.Threshold;
    }

    private async saveIcon(source: string, output: string): Promise<string> {
        if (extname(source) !== "png") {
            this.logger.debug(`Converting ${source} to ${output}`);
            // SVG to PNG
            await this.commandlineUtility.executeCommand(`convert -background none -resize 48x ${source} ${output}`);
        } else {
            // Copy the image
            this.logger.debug(`Copying ${source} to ${output}`);
            await this.fileSystemUtility.copyFile(source, output);
        }
        return output;
    }

    private getCachePath(iconName: string): string {
        return `${join(this.extensionCacheFolder.path, basename(iconName))}.png`;
    }
}
