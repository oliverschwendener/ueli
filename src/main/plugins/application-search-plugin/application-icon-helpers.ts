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

export async function generateMacAppIcons(applications: Application[]): Promise<void> {
    if (applications.length === 0) { return; }
    try {
        const fileExists = await FileHelpers.fileExists(applicationIconLocation);
        if (!fileExists) {
            FileHelpers.createFolderSync(applicationIconLocation);
        }
        const promises = applications.map((application) => {
            return convert(application.filePath, getApplicationIconFilePath(application));
        });
        await Promise.all(promises);

    } catch (error) {
        return error;
    }
}

export async function generateWindowsAppIcons(applications: Application[]): Promise<void> {
    if (applications.length === 0) { return; }
    try {
        const fileExists = await FileHelpers.fileExists(applicationIconLocation);
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
        await generateIcons(icons);
    } catch (error) {
        return error;
    }
}
