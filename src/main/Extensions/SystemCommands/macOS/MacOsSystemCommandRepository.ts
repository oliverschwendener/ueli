import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Translator } from "@Core/Translator";
import type { Translations } from "@common/Core/Extension";
import type { Image } from "@common/Core/Image";
import type { SystemCommand } from "../SystemCommand";
import type { SystemCommandRepository } from "../SystemCommandRepository";
import { MacOsSystemCommand } from "./MacOsSystemCommand";

export class MacOsSystemCommandRepository implements SystemCommandRepository {
    public constructor(
        private readonly translator: Translator,
        private readonly assetPathResolver: AssetPathResolver,
    ) {}

    public async getAll(translations: Translations): Promise<SystemCommand[]> {
        const t = await this.translator.createInstance(translations);

        return [
            new MacOsSystemCommand(
                t("shutdown"),
                t("searchResultItemDescription"),
                `osascript -e 'tell app "System Events" to shut down'`,
                this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-shutdown-on-dark.png",
                    fileNameOnLightBackground: "macos-shutdown-on-light.png",
                }),
                true,
                true,
            ),
            new MacOsSystemCommand(
                t("restart"),
                t("searchResultItemDescription"),
                `osascript -e 'tell app "System Events" to restart'`,
                this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-restart-on-dark.png",
                    fileNameOnLightBackground: "macos-restart-on-light.png",
                }),
                true,
                true,
            ),
            new MacOsSystemCommand(
                t("logOut"),
                t("searchResultItemDescription"),
                `osascript -e 'tell application "System Events" to log out'`,
                this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-logout-on-dark.png",
                    fileNameOnLightBackground: "macos-logout-on-light.png",
                }),
                true,
                true,
            ),
            new MacOsSystemCommand(
                t("sleep"),
                t("searchResultItemDescription"),
                `osascript -e 'tell application "System Events" to sleep'`,
                this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-sleep-on-dark.png",
                    fileNameOnLightBackground: "macos-sleep-on-light.png",
                }),
                true,
                true,
            ),
            new MacOsSystemCommand(
                t("lock"),
                t("searchResultItemDescription"),
                `osascript -e 'tell application "System Events" to keystroke "q" using {control down, command down}'`,
                this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-lock-on-dark.png",
                    fileNameOnLightBackground: "macos-lock-on-light.png",
                }),
                true,
                true,
            ),
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
