import { join, extname, basename } from "path";
import { parse } from "ini"
import { platform, release } from "os";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { applicationIconLocation, getApplicationIconFilePath } from "./application-icon-helpers";
import { executeCommand, executeCommandWithOutput } from "../../executors/command-executor";
import { getCurrentOperatingSystem, getOperatingSystemVersion } from "../../../common/helpers/operating-system-helpers";
import { OperatingSystemVersion } from "../../../common/operating-system";

export function generateLinuxAppIcons(applicationFilePaths: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        if (applicationFilePaths.length === 0) {
            resolve();
        }

        FileHelpers.fileExists(applicationIconLocation)
            .then((fileExistsResult) => {
                if (!fileExistsResult.fileExists) {
                    FileHelpers.createFolderSync(applicationIconLocation);
                }

                getIconThemeName().then((iconTheme) => {
                    Promise.all([iconTheme, "hicolor"].map((t) => buildIconsListFromTheme(t, 48)).concat(buildIconsListFromFolder("/usr/share/pixmap")))
                    .then((iconsLists) => {
                        Promise.all(applicationFilePaths.map((application) => generateLinuxAppIcon(application, iconsLists.flat())))
                            .then(() => resolve())
                            .catch((err) => reject(err));
                    }).catch((err) => reject(err));
                }).catch((err) => reject(err));
            }).catch((err) => reject(err));
    });
}

// Doesn't follow freedesktop specs exactly but seems to work
function generateLinuxAppIcon(applicationFilePath: string, iconsList: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        getAppIconName(applicationFilePath).then((iconName) => {
            if (iconName.length !== 0) {
                const outSvgFilePath = getApplicationIconFilePath(applicationFilePath);
                const icon = iconsList.find((iconPath) => basename(iconPath, extname(iconPath)) === iconName);
                if (icon) {
                    convertSVGtoPng(icon, outSvgFilePath);
                } else {
                    console.error(`Failed to find icon ${iconName}.svg`)
                };
                resolve();
            } else {
                console.error(`Failed to find icon name for ${applicationFilePath}`);
                resolve();
            }
        }).catch((err) => reject(err));
    });
}

function getAppIconName(applicationFilePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        FileHelpers.readFile(applicationFilePath).then((data) => {
            const config = parse(data);
            const iconName = config["Desktop Entry"]["Icon"];
            if (iconName) {
                resolve(JSON.stringify(iconName).slice(1, -1));
            } else {
                resolve("");
            }
        }).catch((err) => reject(err));
    });
}

function getIconThemeName(): Promise<string> {
    return new Promise((resolve, reject) => {
        const desktopEnv = getOperatingSystemVersion(getCurrentOperatingSystem(platform()), release()) ===
        // Only 2 DEs supported as of now (tested with Cinnamon so far)
            OperatingSystemVersion.LinuxGnome ? "gnome" : "cinnamon";
        executeCommandWithOutput(`gsettings get org.${desktopEnv}.desktop.interface icon-theme`)
        .then((iconThemeName) => {
            if (iconThemeName) {
                resolve(iconThemeName.slice(1, -2));
            } else {
                reject("Failed to determine default icon theme");
            }
        }).catch((err) => reject("Error reading default icon theme"));
    });
}

function buildIconsListFromTheme(iconTheme: string, size: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const iconThemePath = join("/usr/share/icons", iconTheme);

        let iconList : Promise<string>[] = [];
        const nonIdealIconList : Promise<string>[] = [];

        FileHelpers.readFile(`${iconThemePath}/index.theme`).then((data) => {
            const themeCofig = parse(data);
            const subdirs : string[] = themeCofig["Icon Theme"]["Directories"].split(",");
            subdirs.reverse().forEach((subdir) => {
                if (Number(themeCofig[subdir]["Size"]) === size) {
                    // Prioritize icons with ideal size
                    iconList.push(executeCommandWithOutput(`find '${join(iconThemePath, subdir)}'`));
                } else {
                    nonIdealIconList.push(executeCommandWithOutput(`find '${join(iconThemePath, subdir)}'`));
                }
            });

            iconList = iconList.concat(nonIdealIconList);

            Promise.allSettled(iconList).then((icons) => {
                let results : string[] = [];
                icons.forEach((result) => {
                    if (result.status === "fulfilled") {
                        results = results.concat(result.value.split("\n").filter(file => [".png", ".svg", ".xpm"].includes(extname(file))));
                    } else {
                        console.error(result.reason);
                    }
                })
                resolve(results);
            })
            .catch((err) => reject(err));

        })
        .catch((err) => reject(`Failed to read index.theme for ${iconTheme}`));
    });
}

function buildIconsListFromFolder(folder: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        executeCommandWithOutput("find /usr/share/pixmaps").then((pixOutput) => {
            const pixelmapFiles = pixOutput.split("\n");
            resolve(pixelmapFiles);
        }).catch((err) => reject(err));
    });
}

function convertSVGtoPng(source: string, output: string): Promise<void>{
    console.debug(`Converting ${source} to ${output}`);
    return executeCommand(`convert -background none -resize 32x ${source} ${output}`);
}