import { FileHelpers } from "../../../common/helpers/file-helpers";
import { applicationIconLocation, getApplicationIconFilePath } from "./application-icon-helpers";
import Shell from "node-powershell";

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

        const iconsJsonBase64 = Buffer.from(JSON.stringify(icons)).toString('base64');

        const powershellCommand = `
            $ErrorActionPreference = "Continue";
            Add-Type -AssemblyName System.Drawing;
            $iconsBase64 = "${iconsJsonBase64}";
            $iconsJson = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($iconsBase64));
            $Shell = New-Object -ComObject WScript.Shell;
            $icons = $iconsJson | ConvertFrom-Json;
            $icons |
            Where-Object { Test-Path -LiteralPath $_.inputFilePath } |
            ForEach-Object {
                    $originalPath = $_.inputFilePath;
                    Try {
                        $path = $Shell.CreateShortcut($originalPath).TargetPath;

                        # fallback to $originalPath if $path is a directory or url
                        if ((Test-Path -Path $path -PathType Container ) -or ($path -match '.url$')) {
                            $path = $originalPath;
                        }
                    } Catch {
                        $path = $originalPath
                    }

                    $icon = $null;
                    Try {
                        $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($path);
                    } Catch {
                        $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($originalPath);
                    }

                    if ($icon -ne $null) {
                        $outputFormat = $_.outputFormat;
                        $bitmap = $icon.ToBitmap().Save($_.outputFilePath, [System.Drawing.Imaging.ImageFormat]::$outputFormat);
                    }
                }
        `;

        ps.addCommand(powershellCommand)
            .then(() => ps.invoke())
            .then((r) => resolve())
            .catch((err) => reject(err))
            .finally(() => ps.dispose());
    });
}
