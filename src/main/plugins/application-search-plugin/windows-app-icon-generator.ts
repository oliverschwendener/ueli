import { FileHelpers } from "../../../common/helpers/file-helpers";
import { applicationIconLocation, getApplicationIconFilePath } from "./application-icon-helpers";
import * as Shell from "node-powershell";

interface Icon {
    inputFilePath: string;
    outputFilePath: string;
    outputFormat: string;
}

export function generateWindowsAppIcons(applicationFilePaths: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        if (applicationFilePaths.length === 0) {
            resolve();
        }

        FileHelpers.fileExists(applicationIconLocation)
            .then((fileExistsResult) => {
                if (!fileExistsResult.fileExists) {
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

function generateIcons(icons: Icon[], followShortcuts?: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
        const ps = new Shell({
            executionPolicy: "Bypass",
            noProfile: true,
        });

        ps.addCommand(`Add-Type -AssemblyName System.Drawing`);

        icons.forEach((icon) => {
            ps.addCommand(`$fileExists = Test-Path -Path "${icon.inputFilePath}";`);
            ps.addCommand(`if($fileExists) { $icon = [System.Drawing.Icon]::ExtractAssociatedIcon("${icon.inputFilePath}"); }`);
            ps.addCommand(`if($fileExists) { $bitmap = $icon.ToBitmap().save("${icon.outputFilePath}", [System.Drawing.Imaging.ImageFormat]::${icon.outputFormat}); }`);
        });

        ps.invoke()
            .then(() => resolve())
            .catch((err) => reject(err))
            .finally(() => ps.dispose());
    });
}
