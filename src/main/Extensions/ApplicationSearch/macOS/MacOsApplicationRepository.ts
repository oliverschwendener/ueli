import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { FileImageGenerator } from "@Core/ImageGenerator";
import type { Logger } from "@Core/Logger";
import type { Image } from "@common/Core/Image";
import { dirname, normalize, parse } from "path";
import type { Application } from "../Application";
import type { ApplicationRepository } from "../ApplicationRepository";
import type { Settings } from "../Settings";
import { MacOsApplication } from "./MacOsApplication";

export class MacOsApplicationRepository implements ApplicationRepository {
    public constructor(
        private readonly commandlineUtility: CommandlineUtility,
        private readonly fileImageGenerator: FileImageGenerator,
        private readonly logger: Logger,
        private readonly settings: Settings,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public async getApplications(): Promise<Application[]> {
        const filePaths = await this.getAllFilePaths();
        const icons = await this.fileImageGenerator.getImages(filePaths);

        return filePaths.map((filePath): Application => {
            const icon = icons[filePath];

            if (!icon) {
                this.logger.warn(`Failed to generate icon for "${filePath}". Using generic icon instead.`);
            }

            return new MacOsApplication(parse(filePath).name, filePath, icon ?? this.getGenericAppIcon());
        });
    }

    private async getAllFilePaths(): Promise<string[]> {
        return (await this.commandlineUtility.executeCommand(`mdfind "${this.getMdFindFilterOption()}"`))
            .split("\n")
            .map((filePath) => normalize(filePath).trim())
            .filter((filePath) => filePath.endsWith(".app"))
            .filter((filePath) => this.filterFilePathByConfiguredFolders(filePath))
            .filter((filePath) => this.filterSubApps(filePath))
            .filter((filePath) => ![".", ".."].includes(filePath));
    }

    private getMdFindFilterOption() {
        const filterOptions: Record<string, string> = {
            "kind:application": "kind:application",
            "kMDItemKind=='Application'": "kMDItemKind == 'Application'",
            "kMDItemContentType=='com.apple.application-bundle'":
                "kMDItemContentType == 'com.apple.application-bundle'",
        };

        return (
            filterOptions[this.settings.getValue<string>("mdfindFilterOption")] ??
            filterOptions[<string>this.settings.getDefaultValue("mdfindFilterOption")]
        );
    }

    private filterFilePathByConfiguredFolders(filePath: string): boolean {
        return this.settings.getValue<string[]>("macOsFolders").some((folderPath) => filePath.startsWith(folderPath));
    }

    private filterSubApps(filePath: string): boolean {
        return !dirname(filePath).includes(".app");
    }

    private getGenericAppIcon(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath("ApplicationSearch", "macos-generic-app-icon.png")}`,
        };
    }
}
