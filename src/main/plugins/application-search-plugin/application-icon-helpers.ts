import { Application } from "./application";
import { join } from "path";
import { createHash } from "crypto";
import { homedir } from "os";
import { convert } from "app2png";
import { Icon, generateIcons } from "windows-system-icon";
import { ApplicationIcon } from "./application-icon";

export const applicationIconLocation = join(homedir(), ".ueli", "application-icons");

export function getApplicationIconFilePath(application: Application): string {
    const fileHashName = createHash("md5").update(`${application.filePath}`).digest("hex");
    return `${join(applicationIconLocation, fileHashName)}.png`;
}

export function getMacAppIcons(applications: Application[]): Promise<ApplicationIcon[]> {
    return new Promise((resolve, reject) => {
        const promises = applications.map((application) => {
            return convert(application.filePath, getApplicationIconFilePath(application));
        });

        Promise.all(promises)
            .then(() => {
                resolve(applications.map((application): ApplicationIcon => {
                    return {
                        filePathToPng: getApplicationIconFilePath(application),
                        name: application.name,
                    };
                }));
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function getWindowsAppIcons(applications: Application[]): Promise<ApplicationIcon[]> {
    return new Promise((resolve, reject) => {
        const icons = applications.map((application): Icon => {
            return {
                inputFilePath: application.filePath,
                outputFilePath: getApplicationIconFilePath(application),
                outputFormat: "Png",
            };
        });

        generateIcons(icons)
            .then(() => {
                resolve(applications.map((application): ApplicationIcon => {
                    return {
                        filePathToPng: getApplicationIconFilePath(application),
                        name: application.name,
                    };
                }));
            })
            .catch((err) => {
                reject(err);
            });
    });
}
