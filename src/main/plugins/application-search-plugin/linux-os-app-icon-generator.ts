import { join, extname, dirname } from "path";
import { parse } from "ini";
import { platform, release, homedir } from "os";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { applicationIconLocation, getApplicationIconFilePath } from "./application-icon-helpers";
import { executeCommand, executeCommandWithOutput } from "../../executors/command-executor";
import { getCurrentOperatingSystem, getOperatingSystemVersion } from "../../../common/helpers/operating-system-helpers";
import { OperatingSystemVersion } from "../../../common/operating-system";

// Should finally follow freedesktop.org specification
// Taken from https://specifications.freedesktop.org/icon-theme-spec/icon-theme-spec-latest.html
interface IconThemeSubdir {
    Size: number;

    Scale: number; // Defaults to 1
    MinSize: number; // Defaults to size
    MaxSize: number; // Defaults to size
    Threshold: number; // Defaults to 2
    Type: "Fixed" | "Scalable" | "Threshold"; // Defaults to Threshold

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
        | "Status"
        | undefined;
}

interface IconTheme {
    themeName: string;
    themeLocation: string;
    themeSubdirectories: Map<string, IconThemeSubdir>;
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
                return getIconThemeName();
            })
            .then((iconThemeName) => Promise.all([getThemeDirectories(iconThemeName), getThemeDirectories("hicolor")]))
            .then(([iconThemeDirs, hicolorThemeDirs]) =>
                Promise.all([
                    Promise.allSettled(iconThemeDirs.map((dir) => parseThemeIndex(join(dir, "index.theme")))),
                    Promise.allSettled(hicolorThemeDirs.map((dir) => parseThemeIndex(join(dir, "index.theme")))),
                ]),
            )
            .then(([iconThemeData, hicolorThemeData]) => {
                let iconThemes: IconTheme[] = [];
                for (const theme of iconThemeData) {
                    if (theme.status === "rejected") throw theme.reason;

                    iconThemes.push(theme.value);
                }

                let hicolorThemes: IconTheme[] = [];
                for (const theme of hicolorThemeData) {
                    if (theme.status === "rejected") throw theme.reason;

                    hicolorThemes.push(theme.value);
                }

                return Promise.allSettled(
                    applicationFilePaths.map((appFilePath) =>
                        generateLinuxAppIcon(appFilePath, iconThemes, hicolorThemes),
                    ),
                );
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                console.error(err);
                reject(err);
            });
    });
}

function generateLinuxAppIcon(applicationFilePath: string, theme: IconTheme[], hicolor: IconTheme[]): Promise<void> {
    return new Promise((resolve, reject) => {
        getAppIconName(applicationFilePath)
            .then((iconName) => {
                if (!iconName) throw `Failed to find icon name for ${applicationFilePath}`;
                findAppIcon(iconName, theme, hicolor)
                    .then((iconPath) => {
                        if (!iconPath) throw `Failed to find icon ${iconName}.svg`;
                        saveIcon(iconPath, getApplicationIconFilePath(applicationFilePath));
                        resolve();
                    })
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

// FindIcon function with scale defaulted to 1x and size to 32px
function findAppIcon(
    icon: string,
    theme: IconTheme[],
    hicolor: IconTheme[],
    size: number = 48,
    scale: number = 1,
): Promise<string> {
    return new Promise((resolve, reject) => {
        lookupIcon(icon, theme, size, scale)
            .then((iconPath) => {
                if (iconPath) return iconPath;
                return lookupIcon(icon, hicolor, size, scale);
            })
            .then((iconPath) => {
                if (iconPath) return iconPath;
                return lookupFallbackIcon(icon);
            })
            .then((iconPath) => {
                return resolve(iconPath);
            })
            .catch((err) => reject(err));
    });
}

function lookupIcon(icon: string, themes: IconTheme[], size: number, scale: number): Promise<string> {
    return new Promise((resolve, reject) => {
        // Search through in order
        for (const theme of themes) {
            for (const [subdir, info] of theme.themeSubdirectories.entries()) {
                for (const extension of ["png", "svg", "xpm"]) {
                    if (directoryMatchesSize(info, size, scale)) {
                        const filename = join(theme.themeLocation, subdir, icon).concat(`.${extension}`);
                        if (FileHelpers.fileExistsSync(filename)) return resolve(filename);
                    }
                }
            }
        }

        let minimalSize = Number.MAX_SAFE_INTEGER;
        let closestFile = "";
        for (const theme of themes) {
            for (const [subdir, info] of theme.themeSubdirectories.entries()) {
                for (const extension of ["png", "svg", "xpm"]) {
                    const filename = join(theme.themeLocation, subdir, icon).concat(`.${extension}`);
                    const dist = directorySizeDistance(info, size, scale);
                    if (dist < minimalSize && FileHelpers.fileExistsSync(filename)) {
                        closestFile = filename;
                        minimalSize = dist;
                    }
                }
            }
        }
        if (closestFile) return resolve(closestFile);

        return resolve("");
    });
}

function directorySizeDistance(
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

    // To make TypeScript happy about having return statements
    throw "Error in Linux App Icon Generator!";
}

function lookupFallbackIcon(iconName: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const searchDirs = getSearchDirectories();

        // No simple way to search directories recursively in NodeJS
        // Command lists all directories recursively inside $dir
        Promise.allSettled(searchDirs.map((dir) => executeCommandWithOutput(`find ${dir} -type d`)))
            .then((results) => {
                for (const result of results) {
                    if (result.status === "rejected") throw result.reason;

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

function directoryMatchesSize(subdir: IconThemeSubdir, iconSize: number, iconScale: number): boolean {
    if (subdir.Scale !== iconScale) return false;

    if (subdir.Type === "Fixed") return subdir.Size === iconSize;

    if (subdir.Type === "Scalable") return subdir.MinSize <= iconSize && iconSize <= subdir.MaxSize;

    if (subdir.Type === "Threshold")
        return subdir.Size - subdir.Threshold <= iconSize && iconSize <= subdir.Size + subdir.Threshold;

    // To make TypeScript happy about having return statements
    throw "Error in Linux App Icon Generator!";
}

// Specification allows for icons to spread over several base directories
function getThemeDirectories(theme: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const iconThemeIndices = getSearchDirectories().map((dir) => join(dir, theme));

        Promise.all(iconThemeIndices.map((path) => FileHelpers.fileExists(path)))
            .then((directories) => {
                // Resolve empty directories use to hicolor
                resolve(directories.filter((dir) => dir.fileExists).map((dir) => dir.filePath));
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
        let desktopEnv: string;

        switch (getOperatingSystemVersion(getCurrentOperatingSystem(platform()), release())) {
            case OperatingSystemVersion.LinuxCinnamon:
                desktopEnv = "gsettings get org.cinnamon.desktop.interface icon-theme";
                break;
            case OperatingSystemVersion.LinuxGnome:
                desktopEnv = "gsettings get org.gnome.desktop.interface icon-theme";
                break;
            case OperatingSystemVersion.LinuxMate:
                desktopEnv = "gsettings get org.mate.interface icon-theme";
                break;
            default:
                throw "Desktop environment not supported!";
        }

        executeCommandWithOutput(desktopEnv)
            .then((iconThemeName) => {
                if (iconThemeName) {
                    resolve(iconThemeName.slice(1, -2)); // -2 to slice both ' and \n
                } else {
                    throw("Failed to determine icon theme");
                }
            })
            .catch((err) => reject(err));
    });
}

function parseThemeIndex(file: string): Promise<IconTheme> {
    return new Promise((resolve, reject) => {
        FileHelpers.readFile(file)
            .then((data) => {
                const themeIndex = parse(data);
                const iconThemeData: { [key: string]: string } = themeIndex["Icon Theme"];

                let subdirs = new Map<string, IconThemeSubdir>();
                const dirList = iconThemeData["Directories"].split(",");
                for (const dir of dirList) {
                    const subdir: IconThemeSubdir = themeIndex[dir];

                    if (!subdir.Size) throw `Theme index ${file} is invalid!`;
                    //Default values
                    if (!subdir.Type) subdir.Type = "Threshold";
                    if (!subdir.Scale) subdir.Scale = 1;
                    if (!subdir.MinSize) subdir.MinSize = subdir.Size;
                    if (!subdir.MaxSize) subdir.MaxSize = subdir.Size;
                    if (!subdir.Threshold) subdir.Threshold = 2;

                    subdirs.set(dir, subdir);
                }

                return resolve({
                    themeName: iconThemeData["Name"],
                    themeLocation: dirname(file),
                    themeSubdirectories: subdirs,
                });
            })
            .catch((err) => reject(err));
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
    ];
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
