import type { FileImageGenerator } from "@Core/ImageGenerator";
import type { Logger } from "@Core/Logger";
import type { PowershellUtility } from "@Core/PowershellUtility";
import type { Image } from "@common/Core/Image";
import { Application } from "../Application";
import type { ApplicationRepository } from "../ApplicationRepository";
import type { Settings } from "../Settings";
import type { WindowsApplicationRetrieverResult } from "./WindowsApplicationRetrieverResult";
import type { WindowsStoreApplication } from "./WindowsStoreApplication";
import { usePowershellScripts } from "./usePowershellScripts";

export class WindowsApplicationRepository implements ApplicationRepository {
    public constructor(
        private readonly powershellUtility: PowershellUtility,
        private readonly settings: Settings,
        private readonly fileImageGenerator: FileImageGenerator,
        private readonly logger: Logger,
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
        const appIcons = await this.getAppIcons(windowsApplicationRetrieverResults.map(({ FullName }) => FullName));

        return windowsApplicationRetrieverResults.map(
            ({ BaseName, FullName }) => new Application(BaseName, FullName, appIcons[FullName]),
        );
    }

    private async getAppIcons(filePaths: string[]): Promise<Record<string, Image>> {
        const result: Record<string, Image> = {};

        const promiseResults = await Promise.allSettled(
            filePaths.map((filePath) => this.fileImageGenerator.getImage(filePath)),
        );

        for (let i = 0; i < filePaths.length; i++) {
            const promiseResult = promiseResults[i];
            if (promiseResult.status === "fulfilled") {
                result[filePaths[i]] = promiseResult.value;
            } else {
                this.logger.error(`Failed to generate app icon for "${filePaths[i]}". Reason: ${promiseResult.reason}`);
            }
        }

        return result;
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
                new Application(DisplayName, `shell:AppsFolder\\${AppId}`, {
                    url: `data:image/png;base64,${LogoBase64}`,
                }),
        );
    }

    private getPowershellScript(folderPaths: string[], fileExtensions: string[]): string {
        const concatenatedFolderPaths = folderPaths.map((folderPath) => `'${folderPath}'`).join(",");
        const concatenatedFileExtensions = fileExtensions.map((fileExtension) => `'*.${fileExtension}'`).join(",");

        const { getWindowsAppsPowershellScript } = usePowershellScripts();

        return `
            ${getWindowsAppsPowershellScript}

            Get-WindowsApps -FolderPaths ${concatenatedFolderPaths} -FileExtensions ${concatenatedFileExtensions};`;
    }
}
