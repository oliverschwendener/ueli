import type { AppleScriptUtility } from "@Core/AppleScriptUtility";
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
        private readonly appleScriptUtility: AppleScriptUtility,
        private readonly resources: Resources<MacOsTranslations>,
    ) {}

    public async getAll(): Promise<SystemCommand[]> {
        const { t } = this.translator.createT(this.resources);

        return [
            MacOsSystemCommand.create({
                name: t("shutdown"),
                description: t("searchResultItemDescription"),
                image: this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-shutdown-on-dark.png",
                    fileNameOnLightBackground: "macos-shutdown-on-light.png",
                }),
                invoke: async () => {
                    await this.appleScriptUtility.executeAppleScript('tell app "System Events" to shut down');
                },
                requiresConfirmation: true,
            }),
            MacOsSystemCommand.create({
                name: t("restart"),
                description: t("searchResultItemDescription"),
                image: this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-restart-on-dark.png",
                    fileNameOnLightBackground: "macos-restart-on-light.png",
                }),
                invoke: async () => {
                    await this.appleScriptUtility.executeAppleScript('tell app "System Events" to restart');
                },
                requiresConfirmation: true,
            }),
            MacOsSystemCommand.create({
                name: t("logOut"),
                description: t("searchResultItemDescription"),
                image: this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-logout-on-dark.png",
                    fileNameOnLightBackground: "macos-logout-on-light.png",
                }),
                invoke: async () => {
                    await this.appleScriptUtility.executeAppleScript('tell application "System Events" to log out');
                },
                requiresConfirmation: true,
            }),
            MacOsSystemCommand.create({
                name: t("sleep"),
                description: t("searchResultItemDescription"),
                image: this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-sleep-on-dark.png",
                    fileNameOnLightBackground: "macos-sleep-on-light.png",
                }),
                invoke: async () => {
                    await this.appleScriptUtility.executeAppleScript('tell application "System Events" to sleep');
                },
                requiresConfirmation: true,
            }),
            MacOsSystemCommand.create({
                name: t("lock"),
                description: t("searchResultItemDescription"),
                image: this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-lock-on-dark.png",
                    fileNameOnLightBackground: "macos-lock-on-light.png",
                }),
                invoke: async () => {
                    await this.appleScriptUtility.executeAppleScript(
                        'tell application "System Events" to keystroke "q" using {control down, command down}',
                    );
                },
                requiresConfirmation: true,
            }),
            MacOsSystemCommand.create({
                name: t("emptyTrash"),
                description: t("searchResultItemDescription"),
                image: this.getImage({
                    fileName: "macos-system-command.png",
                    fileNameOnDarkBackground: "macos-lock-on-dark.png",
                    fileNameOnLightBackground: "macos-lock-on-light.png",
                }),
                invoke: async () => {
                    await this.appleScriptUtility.executeAppleScript('tell application "Finder" to activate');
                    await this.appleScriptUtility.executeAppleScript(
                        'tell application "Finder" to if ((count of items in trash) > 0) then empty trash',
                    );
                },
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
        const getFileUrl = (f: string) => `file://${this.assetPathResolver.getExtensionAssetPath("SystemCommands", f)}`;

        return {
            url: getFileUrl(fileName),
            urlOnDarkBackground: fileNameOnDarkBackground ? getFileUrl(fileNameOnDarkBackground) : undefined,
            urlOnLightBackground: fileNameOnLightBackground ? getFileUrl(fileNameOnLightBackground) : undefined,
        };
    }
}
