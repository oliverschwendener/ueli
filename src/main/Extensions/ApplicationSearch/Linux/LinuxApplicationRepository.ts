import { CommandlineUtility } from "@Core/CommandlineUtility";
import { FileSystemUtility } from "@Core/FileSystemUtility";
import type { FileImageGenerator } from "@Core/ImageGenerator";
import { IniFileParser } from "@Core/IniFileParser/IniFileParser";
import type { Logger } from "@Core/Logger";
import { join } from "path";
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
        private readonly logger: Logger,
        private readonly settings: Settings,
    ) {}

    public async getApplications(): Promise<Application[]> {
        try {

            // For future support of other formats
            const appExtensions = [".desktop"];

                // Finds all application files
            const promises = (
                    await this.commandlineUtility.executeCommand(
                        `find ${this.getApplicationDirectories().join(" ")} -type f -name "*${appExtensions.join('" -o -name "')}"`,
                        true,
                        true,
                    )
                )
                    .split("\n")
                    .filter((t) => t)
                    .map(async (filePath) => {
                        try {
                            // speed check
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

                            const iconImage = await this.fileImageGenerator.getImage(filePath);
                            return new LinuxApplication(config["Name"], filePath, iconImage);
                        } catch (error) {
                            console.log(filePath);
                            console.error(error);
                            throw error;
                        }
                    });

            const results = (await Promise.allSettled(promises)).map(result => result.status === "fulfilled" ? result.value : null).filter(result => result);

            return results;
        } catch (error) {
            console.error(`Error in getApplication! Error: ${error}`);
        }
    }

    // `gtk-launch` can only launch in these directories
    private getApplicationDirectories(): string[] {
        return (process.env["XDG_DATA_DIRS"] || `${join("/", "usr", "local", "share")}:${join("/", "usr", "share")}`)
            .split(":")
            .map((dir) => join(dir, "applications"));
    }
}
