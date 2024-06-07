import type { AssetPathResolver } from "@Core/AssetPathResolver";
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
    ) {}

    public async getAll(resources: Resources<WindowsTranslations>): Promise<SystemCommand[]> {
        const { t } = this.translator.createT(resources);

        return [
            WindowsSystemCommand.create({
                name: t("shutdown"),
                description: t("searchResultItemDescription"),
                command: "shutdown -s -t 0",
                image: this.getImage({ fileName: "windows-11-system-command.png" }),
                requiresConfirmation: true,
            }),
            WindowsSystemCommand.create({
                name: t("restart"),
                description: t("searchResultItemDescription"),
                command: "shutdown -r -t 0",
                image: this.getImage({ fileName: "windows-11-system-command.png" }),
                requiresConfirmation: true,
            }),
            WindowsSystemCommand.create({
                name: t("signOut"),
                description: t("searchResultItemDescription"),
                command: "shutdown /l",
                image: this.getImage({ fileName: "windows-11-system-command.png" }),
                requiresConfirmation: true,
            }),
            WindowsSystemCommand.create({
                name: t("lock"),
                description: t("searchResultItemDescription"),
                command: "rundll32 user32.dll,LockWorkStation",
                image: this.getImage({ fileName: "windows-11-system-command.png" }),
                requiresConfirmation: true,
            }),
            WindowsSystemCommand.create({
                name: t("sleep"),
                description: t("searchResultItemDescription"),
                command: `powershell -NonInteractive -NoProfile -C "$m='[DllImport(\\"Powrprof.dll\\",SetLastError=true)]static extern bool SetSuspendState(bool hibernate,bool forceCritical,bool disableWakeEvent);public static void PowerSleep(){SetSuspendState(false,false,false); }';add-type -name Import -member $m -namespace Dll; [Dll.Import]::PowerSleep();`,
                image: this.getImage({ fileName: "windows-11-system-command.png" }),
                requiresConfirmation: true,
            }),
            WindowsSystemCommand.create({
                name: t("hibernate"),
                description: t("searchResultItemDescription"),
                command: "shutdown /h",
                image: this.getImage({ fileName: "windows-11-system-command.png" }),
                requiresConfirmation: true,
            }),
        ];
    }

    private getImage({ fileName }: { fileName: string }): Image {
        return { url: `file://${this.assetPathResolver.getExtensionAssetPath("SystemCommands", fileName)}` };
    }
}
