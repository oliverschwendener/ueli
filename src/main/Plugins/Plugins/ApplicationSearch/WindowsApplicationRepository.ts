import { join } from "path";
import type { PluginDependencies } from "../../PluginDependencies";
import { Application } from "./Application";
import type { ApplicationRepository } from "./ApplicationRepository";
import type { WindowsApplicationRetrieverResult } from "./WindowsApplicationRetrieverResult";
import { usePowershellScripts } from "./usePowershellScripts";

export class WindowsApplicationRepository implements ApplicationRepository {
    public constructor(
        private readonly pluginDependencies: PluginDependencies,
        private readonly pluginId: string,
    ) {}

    public async getApplications(): Promise<Application[]> {
        const { pluginCacheFolderPath } = this.pluginDependencies;

        const stdout = await this.executeTemporaryPowershellScriptWithOutput(
            this.getPowershellScript(),
            join(pluginCacheFolderPath, "WindowsApplicationSearch.temp.ps1"),
        );

        const windowsApplicationRetrieverResults = <WindowsApplicationRetrieverResult[]>JSON.parse(stdout);

        return windowsApplicationRetrieverResults.map(
            ({ BaseName, FullName, IconFilePath }) => new Application(BaseName, FullName, IconFilePath),
        );
    }

    private async executeTemporaryPowershellScriptWithOutput(script: string, filePath: string): Promise<string> {
        const { fileSystemUtility, commandlineUtility } = this.pluginDependencies;

        await fileSystemUtility.writeTextFile(script, filePath);

        const stdout = await commandlineUtility.executeCommandWithOutput(
            `powershell -NoProfile -NonInteractive -ExecutionPolicy bypass -File "${filePath}"`,
        );

        await fileSystemUtility.removeFile(filePath);

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

        const { extractShortcutPowershellScript, getWindowsAppsPowershellScript } = usePowershellScripts();

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
