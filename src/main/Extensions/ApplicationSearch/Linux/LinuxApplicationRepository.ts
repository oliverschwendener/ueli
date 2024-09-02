import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { FileImageGenerator } from "@Core/ImageGenerator";
import type { IniFileParser } from "@Core/IniFileParser/";
import type { Logger } from "@Core/Logger";
import type { Image } from "@common/Core/Image";
import { extname } from "path";
import type { Application } from "../Application";
import type { ApplicationRepository } from "../ApplicationRepository";
import type { Settings } from "../Settings";
import { LinuxApplication } from "./LinuxApplication";

export class LinuxApplicationRepository implements ApplicationRepository {
    public constructor(
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly fileImageGenerator: FileImageGenerator,
        private readonly iniParser: IniFileParser,
        private readonly environmentVariableProvider: EnvironmentVariableProvider,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly logger: Logger,
        private readonly settings: Settings,
    ) {}

    public async getApplications(): Promise<Application[]> {
        const linuxFolders = this.settings.getValue<string[]>("linuxFolders");

        const filePromises = linuxFolders.map(async (folderPath) => {
            if (!this.fileSystemUtility.isDirectory(folderPath)) {
                throw `${folderPath} doesn't exist or isn't a folder.`;
            }
            return (await this.fileSystemUtility.readDirectory(folderPath)).filter(
                (file) => extname(file) === ".desktop",
            );
        });

        const files = (await Promise.allSettled(filePromises))
            .flatMap((result) => {
                if (result.status === "rejected") {
                    this.logger.warn(result.reason);
                    return null;
                }
                return result.value;
            })
            .filter((value) => value);

        return (await Promise.allSettled(files.map((file) => this.generateLinuxApplication(file))))
            .map((result, index) => {
                if (result.status === "rejected") {
                    this.logger.warn(`Unable to generate Application for ${files[index]}. Reason: ${result.reason}`);
                    return null;
                }
                return result.value;
            })
            .filter((value) => value);
    }

    private async generateLinuxApplication(filePath: string): Promise<LinuxApplication> {
        const config: Record<string, string> = this.iniParser.parseIniFileContent(
            (await this.fileSystemUtility.readFile(filePath)).toString(),
        )["Desktop Entry"];
        // https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html#recognized-keys
        const desktopEnv = this.environmentVariableProvider.get("ORIGINAL_XDG_CURRENT_DESKTOP")?.split(":");
        if (
            !config ||
            !config["Icon"] ||
            config.NoDisplay ||
            (config.OnlyShowIn !== undefined && !config.OnlyShowIn.split(";").some((i) => desktopEnv.includes(i))) ||
            (config.NotShowIn !== undefined && config.NotShowIn.split(";").some((i) => desktopEnv.includes(i)))
        ) {
            return null;
        }

        return new LinuxApplication(config["Name"], filePath, await this.getAppIcon(filePath));
    }

    private async getAppIcon(filePath: string): Promise<Image> {
        try {
            return await this.fileImageGenerator.getImage(filePath);
        } catch (error) {
            this.logger.error(`Failed to find icon for ${filePath}. Reason: ${error}. Falling back to generic icon`);
        }
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath("ApplicationSearch", "linux-generic-app-icon.png")}`,
        };
    }
}
