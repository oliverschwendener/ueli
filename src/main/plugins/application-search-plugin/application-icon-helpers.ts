import { Application } from "./application";
import { join } from "path";
import { createHash } from "crypto";
import { homedir } from "os";
import { convert } from "app2png";
import { Icon, generateIcons } from "windows-system-icon";

export const applicationIconLocation = join(homedir(), ".ueli", "application-icons");

export function getApplicationIconFilePath(application: Application): string {
    const fileHashName = createHash("md5").update(`${application.filePath}`).digest("hex");
    return `${join(applicationIconLocation, fileHashName)}.png`;
}

export function generateMacAppIcons(applications: Application[]): Promise<void> {
    return new Promise((resolve, reject) => {
        if (applications.length === 0) {
            resolve();
        }

        const promises = applications.map((application) => {
            return convert(application.filePath, getApplicationIconFilePath(application));
        });

        Promise.all(promises)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function generateWindowsAppIcons(applications: Application[]): Promise<void> {
    return new Promise((resolve, reject) => {
        if (applications.length === 0) {
            resolve();
        }

        const icons = applications.map((application): Icon => {
            return {
                inputFilePath: application.filePath,
                outputFilePath: getApplicationIconFilePath(application),
                outputFormat: "Png",
            };
        });

        generateIcons(icons)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
}
