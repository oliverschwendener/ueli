import { join, basename, extname } from "path";
import { createHash } from "crypto";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { ueliTempFolder } from "../../../common/helpers/ueli-helpers";
import { StringHelpers } from "../../../common/helpers/string-helpers";
import { generateIcons, Icon } from "windows-system-icon";

export const applicationIconLocation = join(ueliTempFolder, "application-icons");
export const powershellScriptFilePath = join(ueliTempFolder, "generate-icons.ps1");

export function getApplicationIconFilePath(applicationFilePath: string): string {
    const hash = createHash("md5").update(`${applicationFilePath}`).digest("hex");
    const fileName = `${StringHelpers.replaceWhitespace(basename(applicationFilePath).replace(extname(applicationFilePath), "").toLowerCase(), "-")}-${hash}`;
    return `${join(applicationIconLocation, fileName)}.png`;
}

export function generateWindowsAppIcons(applicationFilePaths: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        if (applicationFilePaths.length === 0) {
            resolve();
        }

        FileHelpers.fileExists(applicationIconLocation)
            .then((fileExists) => {
                if (!fileExists) {
                    FileHelpers.createFolderSync(applicationIconLocation);
                }

                const icons = applicationFilePaths.map((applicationFilePath): Icon => {
                    return {
                        inputFilePath: applicationFilePath,
                        outputFilePath: getApplicationIconFilePath(applicationFilePath),
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
