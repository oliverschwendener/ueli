import type { Image } from "@common/Core/Image";
import type { Resources } from "@common/Core/Translator";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { Translator } from "@Core/Translator";
import type { SystemCommand } from "../SystemCommand";
import type { SystemCommandRepository } from "../SystemCommandRepository";
import { LinuxSystemCommand } from "./LinuxSystemCommand";
import type { LinuxTranslations } from "./linuxTranslations";

export class LinuxSystemCommandRepository implements SystemCommandRepository {
    public constructor(
        private readonly translator: Translator,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly commandlineUtility: CommandlineUtility,
        private readonly resources: Resources<LinuxTranslations>,
    ) {}

    public async getAll(): Promise<SystemCommand[]> {
        const { t } = this.translator.createT(this.resources);
        return [
            LinuxSystemCommand.create({
                description: t("searchResultItemDescription"),
                image: this.getImage({ fileName: "trash.png" }),
                invoke: async () => {
                    await this.commandlineUtility.executeCommand("rm -rf ~/.local/share/Trash/*");
                },
                name: t("emptyTrash"),
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
