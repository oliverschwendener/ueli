import type { ExtensionCacheFolder } from "@Core/ExtensionCacheFolder";
import type { PowershellUtility } from "@Core/PowershellUtility";
import { Application } from "../Application";
import type { ApplicationRepository } from "../ApplicationRepository";
import type { Settings } from "../Settings";
import type { WindowsApplicationRetrieverResult } from "./WindowsApplicationRetrieverResult";
import { usePowershellScripts } from "./usePowershellScripts";

export class WindowsApplicationRepository implements ApplicationRepository {
    public constructor(
        private readonly powershellUtility: PowershellUtility,
        private readonly extensionCacheFolder: ExtensionCacheFolder,
        private readonly settings: Settings,
    ) {}

    public async getApplications(): Promise<Application[]> {
        const folderPaths = this.settings.getValue<string[]>("windowsFolders");
        const fileExtensions = this.settings.getValue<string[]>("windowsFileExtensions");

        if (!folderPaths.length || !fileExtensions.length) {
            return [];
        }

        const stdout = await this.powershellUtility.executeScript(
            this.getPowershellScript(folderPaths, fileExtensions),
        );

        const windowsApplicationRetrieverResults = <WindowsApplicationRetrieverResult[]>JSON.parse(stdout);

        return windowsApplicationRetrieverResults.map(
            ({ BaseName, FullName, IconFilePath }) => new Application(BaseName, FullName, IconFilePath),
        );
    }

    private getPowershellScript(folderPaths: string[], fileExtensions: string[]): string {
        const concatenatedFolderPaths = folderPaths.map((folderPath) => `'${folderPath}'`).join(",");
        const concatenatedFileExtensions = fileExtensions.map((fileExtension) => `'*.${fileExtension}'`).join(",");

        const { extractShortcutPowershellScript, getWindowsAppsPowershellScript } = usePowershellScripts();

        return `
            ${extractShortcutPowershellScript}
            ${getWindowsAppsPowershellScript}

            Get-WindowsApps -FolderPaths ${concatenatedFolderPaths} -FileExtensions ${concatenatedFileExtensions} -AppIconFolder '${this.extensionCacheFolder.path}';`;
    }
}
