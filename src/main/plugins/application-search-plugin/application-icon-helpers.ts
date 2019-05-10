import { Application } from "./application";
import { join } from "path";
import { createHash } from "crypto";
import { convert } from "app2png";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { ueliTempFolder } from "../../../common/helpers/ueli-helpers";
import { StringHelpers } from "../../../common/helpers/string-helpers";
import { generateIcons, Icon } from "windows-system-icon";

export const applicationIconLocation = join(ueliTempFolder, "application-icons");
export const powershellScriptFilePath = join(ueliTempFolder, "generate-icons.ps1");

export function getApplicationIconFilePath(application: Application): string {
    const hash = createHash("md5").update(`${application.filePath}`).digest("hex");
    const fileName = `${StringHelpers.replaceWhitespace(application.name.toLowerCase(), "-")}-${hash}`;
    return `${join(applicationIconLocation, fileName)}.png`;
}

export function generateMacAppIcons(applications: Application[]): Promise<void> {
    return new Promise((resolve, reject) => {
        if (applications.length === 0) {
            resolve();
        }

        FileHelpers.fileExists(applicationIconLocation)
            .then((fileExists) => {
                if (!fileExists) {
                    FileHelpers.createFolderSync(applicationIconLocation);
                }

                const promises = applications.map((application) => {
                    return convert(application.filePath, getApplicationIconFilePath(application));
                });

                Promise.all(promises)
                    .then(() => resolve())
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

export function generateWindowsAppIcons(applications: Application[]): Promise<void> {
    return new Promise((resolve, reject) => {
        if (applications.length === 0) {
            resolve();
        }

        FileHelpers.fileExists(applicationIconLocation)
            .then((fileExists) => {
                if (!fileExists) {
                    FileHelpers.createFolderSync(applicationIconLocation);
                }

                const icons = applications.map((application): Icon => {
                    return {
                        inputFilePath: application.filePath,
                        outputFilePath: getApplicationIconFilePath(application),
                        outputFormat: "Png",
                    };
                });

                generateIcons(icons)
                    .then(() => resolve())
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}
