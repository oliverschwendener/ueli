import type { AssetPathResolver } from "@Core/AssetPathResolver";
import { CommandlineUtility } from "@Core/CommandlineUtility";
import { FileSystemUtility } from "@Core/FileSystemUtility";
import type { FileImageGenerator } from "@Core/ImageGenerator";
import { IniFileParser } from "@Core/IniFileParser/IniFileParser";
import type { Logger } from "@Core/Logger";
import type { Image } from "@common/Core/Image";
import { Application } from "../Application";
import { ApplicationRepository } from "../ApplicationRepository";
import type { Settings } from "../Settings";
import { LinuxApplication } from "./LinuxApplication";

export class LinuxApplicationRepository implements ApplicationRepository {
    public constructor(
        private readonly commandlineUtility: CommandlineUtility,
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly fileImageGenerator: FileImageGenerator,
        private readonly iniParser: IniFileParser,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly logger: Logger,
        private readonly settings: Settings,
    ) {}

    public async getApplications(): Promise<Application[]> {
        try {
            // For future support of other formats
            const linuxFolders = this.settings.getValue<string[]>("linuxFolders");
            const appExtensions = this.settings.getValue<string[]>("linuxFileExtensions");

            this.logger.info(
                `find -L ${linuxFolders.join(" ")} -type f -name "*${appExtensions.join('" -o -name "')}"`,
            );

            // Finds all application files
            const promises = (
                await this.commandlineUtility.executeCommand(
                    `find -L ${linuxFolders.join(" ")} -type f -name "*${appExtensions.join('" -o -name "')}"`,
                    true,
                    true,
                )
            )
                .split("\n")
                .filter((t) => t)
                .map(async (filePath) => {
                    try {
                        const config: Record<string, string> = this.iniParser.parseIniFileContent(
                            (await this.fileSystemUtility.readFile(filePath)).toString(),
                        )["Desktop Entry"];
                        // Checks if app is supposed to be shown, returns null if not
                        // https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html#recognized-keys
                        const desktopEnv = process.env["XDG_CURRENT_DESKTOP"].split(":") || ["GNOME"];
                        if (
                            !config ||
                            !config["Icon"] ||
                            config.NoDisplay ||
                            (config.OnlyShowIn !== undefined &&
                                !config.OnlyShowIn.split(";").some((i) => desktopEnv.includes(i))) ||
                            (config.NotShowIn !== undefined &&
                                config.NotShowIn.split(";").some((i) => desktopEnv.includes(i)))
                        )
                            return null;

                        const iconImage =
                            (await this.fileImageGenerator.getImage(filePath)) ?? this.getGenericAppIcon();
                        return new LinuxApplication(config["Name"], filePath, iconImage);
                    } catch (error) {
                        this.logger.error(`Error in ApplicationSearch! Reason: ${error}`);
                    }
                });

            const results = (await Promise.allSettled(promises))
                .map((result) => (result.status === "fulfilled" ? result.value : null))
                .filter((result) => result);

            return results;
        } catch (error) {
            this.logger.error(`Error in ApplicationSearch! Error: ${error}`);
        }
    }

    private getGenericAppIcon(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath("ApplicationSearch", "linux-generic-app-icon.png")}`,
        };
    }
}
