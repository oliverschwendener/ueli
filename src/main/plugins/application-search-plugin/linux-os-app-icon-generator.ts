import { join, extname, basename, dirname } from "path";
import { parse } from "ini";
import { platform, release, homedir } from "os";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { applicationIconLocation, getApplicationIconFilePath } from "./application-icon-helpers";
import { executeCommand, executeCommandWithOutput } from "../../executors/command-executor";
import { getCurrentOperatingSystem, getOperatingSystemVersion } from "../../../common/helpers/operating-system-helpers";
import { OperatingSystemVersion } from "../../../common/operating-system";

// Should follow the freedesktop.org's specification
// Taken from https://specifications.freedesktop.org/icon-theme-spec/icon-theme-spec-latest.html

interface SubdirInfo {
    Size: number;

    Scale: number; // Defaults to 1
    MinSize: number; // Defaults to size
    MaxSize: number; // Defaults to size
    Threshold: number; // Defaults to 2

    // Available contexts taken from https://specifications.freedesktop.org/icon-naming-spec/latest/ar01s02.html
    Context:
        | "Actions"
        | "Animations"
        | "Applications"
        | "Categories"
        | "Devices"
        | "Emblems"
        | "Emotes"
        | "International"
        | "MimeTypes"
        | "Places"
        | "Status";
    Type: "Fixed" | "Scalable" | "Threshold";
}

interface ThemeDataCache {
    themeDirectories: Map<string, string[]>;
}

export function generateLinuxAppIcons(applicationFilePaths: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        if (applicationFilePaths.length === 0) {
            return resolve();
        }

        FileHelpers.fileExists(applicationIconLocation)
            .then((fileExistsResult) => {
                if (!fileExistsResult.fileExists) {
                    FileHelpers.createFolderSync(applicationIconLocation);
                }

                getIconThemeName()
                    .then((iconTheme) => {
                        let themeData: ThemeDataCache = {
                            themeDirectories: new Map(),
                        };
                        Promise.allSettled(
                            applicationFilePaths.map((appFilePath) =>
                                generateLinuxAppIcon(appFilePath, iconTheme, themeData),
                            ),
                        )
                            .then(() => {
                                return resolve();
                            })
                            .catch((err) => reject(err));
                    })
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

// FindIcon function with scale defaulted to 1x and size to 32px
function findAppIcon(
    cache: ThemeDataCache,
    theme: string,
    icon: string,
    size: number = 48,
    scale: number = 1,
): Promise<string> {
    return new Promise((resolve, reject) => {
        lookupIcon(icon, size, scale, theme, cache)
            .then((iconPath) => {
                if (iconPath) return resolve(iconPath);

                lookupIcon(icon, size, scale, "hicolor", cache)
                    .then((iconPath) => {
                        if (iconPath) return resolve(iconPath);

                        lookupFallbackIcon(icon)
                            .then((iconPath) => {
                                return resolve(iconPath);
                            })
                            .catch((err) => reject(err));
                    })
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

function lookupIcon(icon: string, size: number, scale: number, theme: string, cache: ThemeDataCache): Promise<string> {
    return new Promise((resolve, reject) => {
        getThemeDirectories(theme, cache)
            .then((themeDirectory) => {
                // Search through in order
                Promise.allSettled(
                    themeDirectory.map(
                        (dir) =>
                            new Promise<[string, string]>((resolve, reject) => {
                                FileHelpers.readFile(dir)
                                    .then((data) => {
                                        resolve([dir, data]);
                                    })
                                    .catch((err) => reject(err));
                            }),
                    ),
                )
                    .then((results) => {
                        for (const result of results) {
                            if (result.status === "rejected") return reject(result.reason);

                            const path = dirname(result.value[0]);
                            const themeIndex = parse(result.value[1]);

                            const directoryList: string = themeIndex["Icon Theme"]["Directories"];
                            const directories = directoryList.split(",");

                            for (const dir of directories) {
                                const subdir: SubdirInfo = themeIndex[dir];

                                //Default values
                                if (!subdir.Type) subdir.Type = "Threshold";
                                if (!subdir.Scale) subdir.Scale = 1;
                                if (!subdir.MinSize) subdir.MinSize = subdir.Size;
                                if (!subdir.MaxSize) subdir.MaxSize = subdir.Size;
                                if (!subdir.Threshold) subdir.Threshold = 2;

                                for (const extension of ["png", "svg", "xpm"]) {
                                    if (DirectoryMatchesSize(subdir, size, scale)) {
                                        const filename = join(path, dir, icon).concat(`.${extension}`);
                                        if (FileHelpers.fileExistsSync(filename)) return resolve(filename);
                                    }
                                }
                            }
                        }
                        for (const result of results) {
                            if (result.status === "rejected") return reject(result.reason);

                            const path = dirname(result.value[0]);
                            const themeIndex = parse(result.value[1]);

                            const directoryList: string = themeIndex["Icon Theme"]["Directories"];
                            const directories = directoryList.split(",");

                            let minimalSize = Number.MAX_SAFE_INTEGER;
                            let closestFile = "";
                            for (const dir of directories) {
                                const subdir: SubdirInfo = themeIndex[dir];

                                //Default values
                                if (!subdir.Type) subdir.Type = "Threshold";
                                if (!subdir.Scale) subdir.Scale = 1;
                                if (!subdir.MinSize) subdir.MinSize = subdir.Size;
                                if (!subdir.MaxSize) subdir.MaxSize = subdir.Size;
                                if (!subdir.Threshold) subdir.Threshold = 2;

                                for (const extension of ["png", "svg", "xpm"]) {
                                    const filename = join(path, dir, icon).concat(`.${extension}`);
                                    const dist = directorySizeDistance(subdir, size, scale);
                                    if (FileHelpers.fileExistsSync(filename) && dist < minimalSize) {
                                        closestFile = filename;
                                        minimalSize = dist;
                                    }
                                }
                            }
                            if (closestFile) return resolve(closestFile);
                        }

                        return resolve("");
                    })
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

function directorySizeDistance(
    { Type, Context, MaxSize, MinSize, Scale, Size, Threshold }: SubdirInfo,
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

    throw "this isnt possible";
}

function lookupFallbackIcon(iconName: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const searchDirs = getSearchDirectories();

        // No simple way to search directories recursively in NodeJS
        // Command lists all directories recursively inside $dir
        Promise.allSettled(searchDirs.map((dir) => executeCommandWithOutput(`find ${dir} -type d`)))
            .then((results) => {
                for (const result of results) {
                    if (result.status === "rejected") return reject(result.reason);

                    const dirs = result.value.split("\n");
                    for (const dir of dirs) {
                        for (const extension of ["png", "svg", "xpm"]) {
                            const fileName = join(dir, `${iconName}.${extension}`);
                            if (FileHelpers.fileExistsSync(fileName)) return resolve(fileName);
                        }
                    }
                }
                return resolve("");
            })
            .catch((err) => reject(err));
    });
}

function DirectoryMatchesSize(subdir: SubdirInfo, iconSize: number, iconScale: number): boolean {
    if (subdir.Scale !== iconScale) return false;

    if (subdir.Type === "Fixed") return subdir.Size === iconSize;

    if (subdir.Type === "Scalable") return subdir.MinSize <= iconSize && iconSize <= subdir.MaxSize;

    if (subdir.Type === "Threshold")
        return subdir.Size - subdir.Threshold <= iconSize && iconSize <= subdir.Size + subdir.Threshold;

    throw "how did we get here";
}

// Specifications allow for icons to spread over several base directories
function getThemeDirectories(theme: string, cache: ThemeDataCache): Promise<string[]> {
    return new Promise((resolve, reject) => {
        if (cache.themeDirectories.has(theme)) return resolve(cache.themeDirectories.get(theme)!);

        const iconThemeIndices = getSearchDirectories().map((dir) => join(dir, theme, "index.theme"));

        let directories: string[] = [];

        iconThemeIndices.forEach((path) => {
            if (FileHelpers.fileExistsSync(path)) {
                directories.push(path);
            }
        });

        if (directories.length !== 0) {
            cache.themeDirectories.set(theme, directories);
            return resolve(directories);
        }
        // Theme could not be found
        reject(`The theme ${theme} could not be found!`);
    });
}

function generateLinuxAppIcon(applicationFilePath: string, themeName: string, cache: ThemeDataCache): Promise<void> {
    return new Promise((resolve, reject) => {
        getAppIconName(applicationFilePath)
            .then((iconName) => {
                if (iconName.length !== 0) {
                    const outputPath = getApplicationIconFilePath(applicationFilePath);
                    findAppIcon(cache, themeName, iconName)
                        .then((iconPath) => {
                            if (iconPath) {
                                saveIcon(iconPath, outputPath);
                            } else {
                                console.error(`Failed to find icon ${iconName}.svg`);
                            }

                            resolve();
                        })
                        .catch((err) => reject(err));
                } else {
                    console.error(`Failed to find icon name for ${applicationFilePath}`);
                    resolve();
                }
            })
            .catch((err) => reject(err));
    });
}

function getAppIconName(applicationFilePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        FileHelpers.readFile(applicationFilePath)
            .then((data) => {
                const config = parse(data);
                const iconName = config["Desktop Entry"]["Icon"];
                if (iconName) {
                    resolve(JSON.stringify(iconName).slice(1, -1));
                } else {
                    resolve("");
                }
            })
            .catch((err) => reject(err));
    });
}

function getIconThemeName(): Promise<string> {
    return new Promise((resolve, reject) => {
        const desktopEnv =
            getOperatingSystemVersion(getCurrentOperatingSystem(platform()), release()) ===
            // Only 2 DEs supported as of now (tested with Cinnamon so far)
            OperatingSystemVersion.LinuxGnome
                ? "gnome"
                : "cinnamon";
        executeCommandWithOutput(`gsettings get org.${desktopEnv}.desktop.interface icon-theme`)
            .then((iconThemeName) => {
                if (iconThemeName) {
                    resolve(iconThemeName.slice(1, -2)); // -2 to slice both ' and \n
                } else {
                    reject("Failed to determine icon theme");
                }
            })
            .catch((err) => reject("Error reading icon theme"));
    });
}

function getSearchDirectories(): string[] {
    const xdgDataHome = process.env["XDG_DATA_HOME"] || join(homedir(), ".local", "share");
    const xdgDataDirs = process.env["XDG_DATA_DIRS"] || `${join("usr", "local", "share")}:${join("usr", "share")}`;

    return [
        join(homedir(), ".icons"),
        join(xdgDataHome, "icons"),
        ...xdgDataDirs.split(":").map((dir) => join(dir, "icons")),
        join("/", "usr", "share", "pixmaps"),
    ].filter((dir) => FileHelpers.fileExistsSync(dir));
}

function saveIcon(source: string, output: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (extname(source) !== "png") {
            console.debug(`Converting ${source} to ${output}`);
            // Required inkscape to be installed on Linux Mint 21.2
            executeCommand(`convert -background none -resize 32x ${source} ${output}`);
            return resolve();
        }
        // Copy the image
        console.debug(`Copying ${source} to ${output}`);
        FileHelpers.copyFile(source, output)
            .then(() => {
                resolve();
            })
            .catch((err) => reject(err));
    });
}
