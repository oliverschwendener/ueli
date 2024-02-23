import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { FileImageGenerator } from "@Core/ImageGenerator";
import type { Logger } from "@Core/Logger";
import type { Image } from "@common/Core/Image";
import { dirname, normalize, parse } from "path";
import { Application } from "../Application";
import type { ApplicationRepository } from "../ApplicationRepository";
import type { Settings } from "../Settings";

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
        const icons = await this.getAllIcons(filePaths);

        return filePaths
            .filter((filePath) => !!icons[filePath])
            .map(
                (filePath) =>
                    new Application(
                        parse(filePath).name,
                        filePath,
                        icons[filePath] ?? {
                            url: `file://${this.assetPathResolver.getExtensionAssetPath("ApplicationSearch", "macos-generic-app-icon.png")}`,
                        },
                    ),
            );
    }

    private async getAllFilePaths(): Promise<string[]> {
        return (await this.commandlineUtility.executeCommandWithOutput(`mdfind "kMDItemKind == 'Application'"`))
            .split("\n")
            .map((filePath) => normalize(filePath).trim())
            .filter((filePath) => filePath.endsWith(".app"))
            .filter((filePath) => this.filterFilePathByConfiguredFolders(filePath))
            .filter((filePath) => this.filterSubApps(filePath))
            .filter((filePath) => ![".", ".."].includes(filePath));
    }

    private filterFilePathByConfiguredFolders(filePath: string): boolean {
        return this.settings.getValue<string[]>("macOsFolders").some((folderPath) => filePath.startsWith(folderPath));
    }

    private filterSubApps(filePath: string): boolean {
        return !dirname(filePath).includes(".app");
    }

    private async getAllIcons(filePaths: string[]): Promise<Record<string, Image>> {
        const result: Record<string, Image> = {};

        const promiseResults = await Promise.allSettled(
            filePaths.map((filePath) => this.fileImageGenerator.getImage(filePath)),
        );

        for (let i = 0; i < filePaths.length; i++) {
            const filePath = filePaths[i];
            const promiseResult = promiseResults[i];

            if (promiseResult.status === "fulfilled") {
                result[filePath] = promiseResult.value;
            } else {
                this.logger.error(`Failed to generate icon for '${filePath}. Reason: ${promiseResult.reason}'`);
            }
        }

        return result;
    }
}
