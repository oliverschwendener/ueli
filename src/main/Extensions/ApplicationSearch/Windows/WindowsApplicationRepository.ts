import type { ExtensionCacheFolder } from "@Core/ExtensionCacheFolder";
import type { PowershellUtility } from "@Core/PowershellUtility";
import { getExtensionSettingKey } from "@common/Core/Extension";
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
        const stdout = await this.powershellUtility.executeScript(this.getPowershellScript());

        const windowsApplicationRetrieverResults = <WindowsApplicationRetrieverResult[]>JSON.parse(stdout);

        return windowsApplicationRetrieverResults.map(
            ({ BaseName, FullName, IconFilePath }) => new Application(BaseName, FullName, IconFilePath),
        );
    }

    private getPowershellScript(): string {
        const folderPaths = this.settings
            .getValue<string[]>(getExtensionSettingKey("ApplicationSearch", "windowsFolders"))
            .map((folderPath) => `'${folderPath}'`)
            .join(",");

        const fileExtensions = this.settings
            .getValue<string[]>(getExtensionSettingKey("ApplicationSearch", "windowsFileExtensions"))
            .map((fileExtension) => `'*.${fileExtension}'`)
            .join(",");

        const { extractShortcutPowershellScript, getWindowsAppsPowershellScript } = usePowershellScripts();

        return `
            ${extractShortcutPowershellScript}
            ${getWindowsAppsPowershellScript}

            Get-WindowsApps -FolderPaths ${folderPaths} -FileExtensions ${fileExtensions} -AppIconFolder '${this.extensionCacheFolder.path}';`;
    }
}
