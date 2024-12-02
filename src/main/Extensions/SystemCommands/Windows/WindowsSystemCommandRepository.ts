import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { PowershellUtility } from "@Core/PowershellUtility";
import type { Translator } from "@Core/Translator";
import type { Image } from "@common/Core/Image";
import type { Resources } from "@common/Core/Translator";
import type { SystemCommand } from "../SystemCommand";
import type { SystemCommandRepository } from "../SystemCommandRepository";
import { WindowsSystemCommand } from "./WindowsSystemCommand";
import type { WindowsTranslations } from "./windowsTranslations";

export class WindowsSystemCommandRepository implements SystemCommandRepository {
    public constructor(
        private readonly translator: Translator,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly commandlineUtility: CommandlineUtility,
        private readonly powershellUtility: PowershellUtility,
        private readonly resources: Resources<WindowsTranslations>,
    ) {}

    public async getAll(): Promise<SystemCommand[]> {
        const { t } = this.translator.createT(this.resources);

        return [
            WindowsSystemCommand.create({
                name: t("shutdown"),
                description: t("searchResultItemDescription"),
                image: this.getImage({ fileName: "windows-11-system-command.png" }),
                invoke: async () => {
                    await this.commandlineUtility.executeCommand("shutdown -s -t 0");
                },
                requiresConfirmation: true,
            }),
            WindowsSystemCommand.create({
                name: t("restart"),
                description: t("searchResultItemDescription"),
                image: this.getImage({ fileName: "windows-11-system-command.png" }),
                invoke: async () => {
                    await this.commandlineUtility.executeCommand("shutdown -r -t 0");
                },
                requiresConfirmation: true,
            }),
            WindowsSystemCommand.create({
                name: t("signOut"),
                description: t("searchResultItemDescription"),
                image: this.getImage({ fileName: "windows-11-system-command.png" }),
                invoke: async () => {
                    await this.commandlineUtility.executeCommand("shutdown /l");
                },
                requiresConfirmation: true,
            }),
            WindowsSystemCommand.create({
                name: t("lock"),
                description: t("searchResultItemDescription"),
                image: this.getImage({ fileName: "windows-11-system-command.png" }),
                invoke: async () => {
                    await this.commandlineUtility.executeCommand("rundll32 user32.dll,LockWorkStation");
                },
                requiresConfirmation: true,
            }),
            WindowsSystemCommand.create({
                name: t("sleep"),
                description: t("searchResultItemDescription"),
                image: this.getImage({ fileName: "windows-11-system-command.png" }),
                invoke: async () => {
                    await this.commandlineUtility.executeCommand(
                        `powershell -NonInteractive -NoProfile -C "$m='[DllImport(\\"Powrprof.dll\\",SetLastError=true)]static extern bool SetSuspendState(bool hibernate,bool forceCritical,bool disableWakeEvent);public static void PowerSleep(){SetSuspendState(false,false,false); }';add-type -name Import -member $m -namespace Dll; [Dll.Import]::PowerSleep();`,
                    );
                },
                requiresConfirmation: true,
            }),
            WindowsSystemCommand.create({
                name: t("hibernate"),
                description: t("searchResultItemDescription"),
                image: this.getImage({ fileName: "windows-11-system-command.png" }),
                invoke: async () => {
                    await this.commandlineUtility.executeCommand("shutdown /h");
                },
                requiresConfirmation: true,
            }),
            WindowsSystemCommand.create({
                name: t("emptyTrash"),
                description: t("searchResultItemDescription"),
                image: this.getImage({ fileName: "windows-11-system-command.png" }),
                invoke: async () => {
                    await this.powershellUtility.executeCommand("Clear-RecycleBin -Force");
                },
                requiresConfirmation: true,
            }),
        ];
    }

    private getImage({ fileName }: { fileName: string }): Image {
        return { url: `file://${this.assetPathResolver.getExtensionAssetPath("SystemCommands", fileName)}` };
    }
}
