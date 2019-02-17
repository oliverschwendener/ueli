import { Application } from "./application";
import { join } from "path";
import { createHash } from "crypto";
import { convert } from "app2png";
import { FileHelpers } from "../../helpers/file-helpers";
import { exec } from "child_process";
import { ueliTempFolder } from "../../../common/helpers/ueli-helpers";

export const applicationIconLocation = join(ueliTempFolder, "application-icons");
export const powershellScriptFilePath = join(ueliTempFolder, "generate-icons.ps1");

export function getApplicationIconFilePath(application: Application): string {
    const fileHashName = createHash("md5").update(`${application.filePath}`).digest("hex");
    return `${join(applicationIconLocation, fileHashName)}.png`;
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

                let powershellScript = `
                    Add-Type -AssemblyName System.Drawing;

                    function generateIcon($filePath, $outputFilePath) {
                        $fileExists = Test-Path -Path $filePath;

                        if ($fileExists) {
                            $fileIsShortcut = $filePath.endsWith(".lnk");

                            if ($fileIsShortcut) {
                                try {
                                    $sh = New-Object -ComObject WScript.Shell;
                                    $filePath = $sh.CreateShortcut($filePath).TargetPath;
                                }
                                catch { <# continue #>}
                            }

                            $fileExists = Test-Path -Path $filePath;

                            if ($fileExists) {
                                $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($filePath);
                                $icon.ToBitmap().save($outputFilePath, [System.Drawing.Imaging.ImageFormat]::Png);
                            }
                        }
                    }
                `;

                applications.forEach((application) => {
                    const command = `generateIcon -filePath "${application.filePath}" -outputFilePath "${getApplicationIconFilePath(application)}";`;
                    powershellScript = powershellScript.concat(command);
                });

                FileHelpers.writeFile(powershellScriptFilePath, powershellScript)
                    .then(() => {
                        executePowershellScript(powershellScriptFilePath)
                            .then(() => resolve())
                            .catch((err) => reject(err))
                            .then(() => FileHelpers.deleteFile(powershellScriptFilePath));
                    })
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

function executePowershellScript(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(`powershell -File ${filePath}`, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
