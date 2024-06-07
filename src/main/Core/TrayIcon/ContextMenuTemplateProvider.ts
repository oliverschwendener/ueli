import type { Translator } from "@Core/Translator";
import type { UeliCommandInvoker } from "@Core/UeliCommand";
import type { Resources } from "@common/Core/Translator";
import type { MenuItemConstructorOptions } from "electron";
import type { TrayIconTranslations } from "./TrayIconTranslations";

export class ContextMenuTemplateProvider {
    public constructor(
        private readonly translator: Translator,
        private readonly ueliCommandInvoker: UeliCommandInvoker,
        private readonly resources: Resources<TrayIconTranslations>,
    ) {}

    public async get(): Promise<MenuItemConstructorOptions[]> {
        const { t } = this.translator.createT(this.resources);

        return [
            {
                label: t("trayIcon.contextMenu.show"),
                click: () => this.ueliCommandInvoker.invokeUeliCommand("show"),
            },
            {
                label: t("trayIcon.contextMenu.settings"),
                click: () => this.ueliCommandInvoker.invokeUeliCommand("openSettings"),
            },
            {
                label: t("trayIcon.contextMenu.about"),
                click: () => this.ueliCommandInvoker.invokeUeliCommand("openAbout"),
            },
            {
                label: t("trayIcon.contextMenu.quit"),
                click: () => this.ueliCommandInvoker.invokeUeliCommand("quit"),
            },
        ];
    }
}
