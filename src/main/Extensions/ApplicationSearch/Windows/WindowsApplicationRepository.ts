import type { ExtensionCacheFolder } from "@Core/ExtensionCacheFolder";
import type { PowershellUtility } from "@Core/PowershellUtility";
import { Application } from "../Application";
import type { ApplicationRepository } from "../ApplicationRepository";
import type { Settings } from "../Settings";
import type { WindowsApplicationRetrieverResult } from "./WindowsApplicationRetrieverResult";
import type { WindowsStoreApplication } from "./WindowsStoreApplication";
import { usePowershellScripts } from "./usePowershellScripts";

export class WindowsApplicationRepository implements ApplicationRepository {
    public constructor(
        private readonly powershellUtility: PowershellUtility,
        private readonly extensionCacheFolder: ExtensionCacheFolder,
        private readonly settings: Settings,
    ) {}

    public async getApplications(): Promise<Application[]> {
        const manuallyInstalledApps = await this.getManuallyInstalledApps();
        const windowsStoreApps = await this.getWindowsStoreApps();

        return [...manuallyInstalledApps, ...windowsStoreApps];
    }

    private async getManuallyInstalledApps(): Promise<Application[]> {
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
            ({ BaseName, FullName, IconFilePath }) => new Application(BaseName, FullName, `file://${IconFilePath}`),
        );
    }

    private async getWindowsStoreApps(): Promise<Application[]> {
        const includeWindowsStoreApps = this.settings.getValue<boolean>("includeWindowsStoreApps");

        if (!includeWindowsStoreApps) {
            return [];
        }

        const { getWindowsStoreApps } = usePowershellScripts();
        const stdout = await this.powershellUtility.executeScript(getWindowsStoreApps);

        const windowStoreApplications = <WindowsStoreApplication[]>JSON.parse(stdout);

        return windowStoreApplications.map(
            ({ AppId, DisplayName, LogoBase64 }) =>
                new Application(DisplayName, `shell:AppsFolder\\${AppId}`, `data:image/png;base64,${LogoBase64}`),
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
