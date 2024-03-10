import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { FileImageGenerator } from "@Core/ImageGenerator";
import type { Logger } from "@Core/Logger";
import type { PowershellUtility } from "@Core/PowershellUtility";
import type { Image } from "@common/Core/Image";
import type { Application } from "../Application";
import type { ApplicationRepository } from "../ApplicationRepository";
import type { Settings } from "../Settings";
import { WindowsApplication } from "./WindowsApplication";
import type { WindowsApplicationRetrieverResult } from "./WindowsApplicationRetrieverResult";
import type { WindowsStoreApplication } from "./WindowsStoreApplication";
import { usePowershellScripts } from "./usePowershellScripts";

export class WindowsApplicationRepository implements ApplicationRepository {
    public constructor(
        private readonly powershellUtility: PowershellUtility,
        private readonly settings: Settings,
        private readonly fileImageGenerator: FileImageGenerator,
        private readonly logger: Logger,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public async getApplications(): Promise<Application[]> {
        const manuallyInstalledApps = await this.getManuallyInstalledApps();
        const windowsStoreApps = await this.getWindowsStoreApps();

        return [...manuallyInstalledApps, ...windowsStoreApps];
    }

    private async getManuallyInstalledApps(): Promise<WindowsApplication[]> {
        const folderPaths = this.settings.getValue<string[]>("windowsFolders");
        const fileExtensions = this.settings.getValue<string[]>("windowsFileExtensions");

        if (!folderPaths.length || !fileExtensions.length) {
            return [];
        }

        const stdout = await this.powershellUtility.executeScript(
            this.getPowershellScript(folderPaths, fileExtensions),
        );

        const windowsApplicationRetrieverResults = <WindowsApplicationRetrieverResult[]>JSON.parse(stdout);
        const appIcons = await this.fileImageGenerator.getImages(
            windowsApplicationRetrieverResults.map(({ FullName }) => FullName),
        );

        return windowsApplicationRetrieverResults.map(({ BaseName, FullName }) => {
            const icon = appIcons[FullName];

            if (!icon) {
                this.logger.warn(`Failed to generate icon for "${FullName}". Using generic icon instead`);
            }

            return new WindowsApplication(BaseName, FullName, icon ?? this.getGenericAppIcon());
        });
    }

    private async getWindowsStoreApps(): Promise<WindowsApplication[]> {
        const includeWindowsStoreApps = this.settings.getValue<boolean>("includeWindowsStoreApps");

        if (!includeWindowsStoreApps) {
            return [];
        }

        const { getWindowsStoreApps } = usePowershellScripts();

        const stdout = await this.powershellUtility.executeScript(getWindowsStoreApps);

        const windowStoreApplications = <WindowsStoreApplication[]>JSON.parse(stdout);

        return windowStoreApplications.map(
            ({ AppId, DisplayName, LogoBase64 }) =>
                new WindowsApplication(DisplayName, `shell:AppsFolder\\${AppId}`, {
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

    private getGenericAppIcon(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath("ApplicationSearch", "windows-generic-app-icon.png")}`,
        };
    }
}
