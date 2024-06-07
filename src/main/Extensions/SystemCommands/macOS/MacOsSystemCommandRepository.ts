import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Translator } from "@Core/Translator";
import type { Image } from "@common/Core/Image";
import type { Resources } from "@common/Core/Translator";
import type { SystemCommand } from "../SystemCommand";
import type { SystemCommandRepository } from "../SystemCommandRepository";
import { MacOsSystemCommand } from "./MacOsSystemCommand";
import type { MacOsTranslations } from "./macOsTranslations";

export class MacOsSystemCommandRepository implements SystemCommandRepository {
    public constructor(
        private readonly translator: Translator,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public async getAll(resources: Resources<MacOsTranslations>): Promise<SystemCommand[]> {
        const { t } = this.translator.createT(resources);

        return [
            MacOsSystemCommand.create({
                name: t("shutdown"),
                description: t("searchResultItemDescription"),
                appleScript: `tell app "System Events" to shut down`,
                image: this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-shutdown-on-dark.png",
                    fileNameOnLightBackground: "macos-shutdown-on-light.png",
                }),
                requiresConfirmation: true,
            }),
            MacOsSystemCommand.create({
                name: t("restart"),
                description: t("searchResultItemDescription"),
                appleScript: `tell app "System Events" to restart`,
                image: this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-restart-on-dark.png",
                    fileNameOnLightBackground: "macos-restart-on-light.png",
                }),
                requiresConfirmation: true,
            }),
            MacOsSystemCommand.create({
                name: t("logOut"),
                description: t("searchResultItemDescription"),
                appleScript: `tell application "System Events" to log out`,
                image: this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-logout-on-dark.png",
                    fileNameOnLightBackground: "macos-logout-on-light.png",
                }),
                requiresConfirmation: true,
            }),
            MacOsSystemCommand.create({
                name: t("sleep"),
                description: t("searchResultItemDescription"),
                appleScript: `tell application "System Events" to sleep`,
                image: this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-sleep-on-dark.png",
                    fileNameOnLightBackground: "macos-sleep-on-light.png",
                }),
                requiresConfirmation: true,
            }),
            MacOsSystemCommand.create({
                name: t("lock"),
                description: t("searchResultItemDescription"),
                appleScript: `tell application "System Events" to keystroke "q" using {control down, command down}`,
                image: this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-lock-on-dark.png",
                    fileNameOnLightBackground: "macos-lock-on-light.png",
                }),
                requiresConfirmation: true,
            }),
        ];
    }

    private getImage({
        fileName,
        fileNameOnDarkBackground,
        fileNameOnLightBackground,
    }: {
        fileName: string;
        fileNameOnDarkBackground?: string;
        fileNameOnLightBackground?: string;
    }): Image {
        const getFileUrl = (f?: string) =>
            f ? `file://${this.assetPathResolver.getExtensionAssetPath("SystemCommands", f)}` : undefined;

        return {
            url: getFileUrl(fileName),
            urlOnDarkBackground: getFileUrl(fileNameOnDarkBackground),
            urlOnLightBackground: getFileUrl(fileNameOnLightBackground),
        };
    }
}
