import { join } from "path";
import { parse } from "ini"
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { applicationIconLocation, getApplicationIconFilePath } from "./application-icon-helpers";
import { executeCommand, executeCommandWithOutput } from "../../executors/command-executor";

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
                    Promise.all([iconTheme, "hicolor"].map((t) => buildIconsList(t))).then((iconsLists) => {
                        Promise.all(applicationFilePaths.map((application) => generateLinuxAppIcon(application, iconsLists[0], iconsLists[1])))
                            .then(() => resolve())
                            .catch((err) => reject(err));
                    }).catch((err) => reject(err));
                }).catch((err) => reject(err));
            }).catch((err) => reject(err));
    });
}

// This written pretty awful and probably needs to be fixed
function generateLinuxAppIcon(applicationFilePath: string, iconsList: string[], fallbackIconList: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        getAppIconName(applicationFilePath).then((iconName) => {
            if (iconName.length != 0) {
                const outSvgFilePath = getApplicationIconFilePath(applicationFilePath);
                // I don't think resolve() breaks forEach, does it? Anyway it's wacky and hacky solution.
                iconsList.forEach((iconPath) =>{
                    if (iconPath.includes(`${iconName}.svg`) || iconPath.includes(`${iconName}-symbolic.svg`)) {
                        convertSVGtoPng(iconPath, outSvgFilePath)
                            .then(() => resolve())
                            .catch((err) => reject(err));
                    }
                });
                fallbackIconList.forEach((iconPath) =>{
                    if (iconPath.includes(`${iconName}.svg`) || iconPath.includes(`${iconName}-symbolic.svg`)) {
                        convertSVGtoPng(iconPath, outSvgFilePath)
                            .then(() => resolve())
                            .catch((err) => reject(err));
                    }
                });
                console.error(`Failed to find icon ${iconName}.svg`);
                resolve();
            } else {
                console.error(`Failed to find icon for ${applicationFilePath}`);
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
        FileHelpers.readFile("/usr/share/icons/default/index.theme").then((data) => {
            const config = parse(data);
            const iconThemeName = config["Icon Theme"]["Inherits"];
            if (iconThemeName) {
                resolve(JSON.stringify(iconThemeName).slice(1, -1));
            } else {
                reject("Failed to determine default icon theme");
            }
        }).catch((err) => reject("Error reading default icon theme"));
    });
}

function buildIconsList(iconTheme: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const iconThemePath = join("/usr/share/icons", iconTheme, "scalable");

        executeCommandWithOutput(`find ${iconThemePath}`).then((output) => {
            const iconFiles = output.split("\n");
            executeCommandWithOutput("find /usr/share/pixmaps").then((output) => {
                const pixelmapFiles = output.split("\n");
                resolve(iconFiles.concat(pixelmapFiles));
            }).catch((err) => reject(err));
        }).catch((err) => reject(err));

    });
}

function convertSVGtoPng(source: string, output: string): Promise<void>{
    console.debug(`Converting ${source} to ${output}`);
    return executeCommand(`convert -background none -density 1000 -resize 256x ${source} ${output}`);
}