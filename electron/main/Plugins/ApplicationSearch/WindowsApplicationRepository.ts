import { join } from "path";
import type { PluginDependencies } from "../PluginDependencies";
import { Application } from "./Application";
import type { ApplicationRepository } from "./ApplicationRepository";

type WindowsApplicationRetrieverResult = {
    BaseName: string;
    FullName: string;
    IconFilePath: string;
};

const extractShortcutPowershellScript = `
    function Extract-Shortcut {
        param(
            [string]$ShortcutFilePath
        )

        try {
            $Shell = New-Object -ComObject WScript.Shell
            $TargetPath = $Shell.CreateShortcut($ShortcutFilePath).TargetPath
            $TargetPathAccessible = Test-Path -Path $TargetPath -PathType Leaf
            if ($TargetPathAccessible) {
                return $TargetPath
            }
            else {
                return $ShortcutFilePath
            }
        }
        catch {
            return $ShortcutFilePath
        }
    }`;

const getWindowsAppsPowershellScript = `
    function Get-WindowsApps {
        param(
            [string[]]$FolderPaths,
            [string[]]$FileExtensions,
            [string]$AppIconFolder
        )

        Add-Type -AssemblyName System.Drawing

        $Utf8 = New-Object -TypeName System.Text.UTF8Encoding

        $Files = Get-ChildItem -File -Path $FolderPaths -Recurse -Include $FileExtensions | Select-Object -Property Name, FullName, Extension, BaseName

        foreach ($File in $Files) {
            $Hash = [convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($File.FullName))
            $IconFilePath = "$($AppIconFolder)\\$($Hash).png"
            $File | Add-Member -MemberType NoteProperty -Name "IconFilePath" -Value $IconFilePath

            $IconAlreadyExists = Test-Path -LiteralPath $File.IconFilePath

            if (!$IconAlreadyExists) {
                $FilePathToExtractIcon = $File.FullName

                if ($File.Extension -eq ".lnk") {
                    $FilePathToExtractIcon = Extract-Shortcut -ShortcutFilePath $File.FullName
                }

                $Icon = [System.Drawing.Icon]::ExtractAssociatedIcon($FilePathToExtractIcon)

                if ($Icon -ne $null) {
                    $Icon.ToBitmap().Save($File.IconFilePath, [System.Drawing.Imaging.ImageFormat]::Png)
                }
            }
        }

        $Files | ConvertTo-Json -Compress
    }`;

export class WindowsApplicationRepository implements ApplicationRepository {
    public constructor(
        private readonly pluginDependencies: PluginDependencies,
        private readonly pluginId: string,
    ) {}

    public async getApplications(): Promise<Application[]> {
        const stdout = await this.executeTemporaryPowershellScriptWithOutput();
        const windowsApplicationRetrieverResults = <WindowsApplicationRetrieverResult[]>JSON.parse(stdout);

        return windowsApplicationRetrieverResults.map(
            ({ BaseName, FullName, IconFilePath }) => new Application(BaseName, FullName, IconFilePath),
        );
    }

    private async executeTemporaryPowershellScriptWithOutput(): Promise<string> {
        const { pluginCacheFolderPath, fileSystemUtility, commandlineUtility } = this.pluginDependencies;

        const temporaryPowershellScriptFilePath = join(pluginCacheFolderPath, "WindowsApplicationSearch.temp.ps1");

        await fileSystemUtility.writeTextFile(this.getPowershellScript(), temporaryPowershellScriptFilePath);

        const stdout = await commandlineUtility.executeCommandWithOutput(
            `powershell -NoProfile -NonInteractive -ExecutionPolicy bypass -File "${temporaryPowershellScriptFilePath}"`,
        );

        await fileSystemUtility.removeFile(temporaryPowershellScriptFilePath);

        return stdout;
    }

    private getPowershellScript(): string {
        const { pluginCacheFolderPath, settingsManager } = this.pluginDependencies;

        const folderPaths = settingsManager
            .getPluginSettingByKey(this.pluginId, "windowsFolders", this.getDefaultFolderPaths())
            .map((folderPath) => `'${folderPath}'`)
            .join(",");

        const fileExtensions = settingsManager
            .getPluginSettingByKey(this.pluginId, "windowsFileExtensions", this.getDefaultFileExtensions())
            .map((fileExtension) => `'*.${fileExtension}'`)
            .join(",");

        return `
            ${extractShortcutPowershellScript}
            ${getWindowsAppsPowershellScript}

            Get-WindowsApps -FolderPaths ${folderPaths} -FileExtensions ${fileExtensions} -AppIconFolder '${pluginCacheFolderPath}';`;
    }

    private getDefaultFolderPaths(): string[] {
        const { app } = this.pluginDependencies;

        return [
            "C:\\ProgramData\\Microsoft\\Windows\\Start Menu",
            join(app.getPath("home"), "AppData", "Roaming", "Microsoft", "Windows", "Start Menu"),
        ];
    }

    private getDefaultFileExtensions(): string[] {
        return ["lnk"];
    }
}
