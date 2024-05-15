import type { Translator } from "@Core/Translator";
import type { UeliCommandInvoker } from "@Core/UeliCommand";
import type { Translations } from "@common/Core/Extension";
import type { MenuItemConstructorOptions } from "electron";

export class ContextMenuTemplateProvider {
    public constructor(
        private readonly translator: Translator,
        private readonly ueliCommandInvoker: UeliCommandInvoker,
        private readonly translations: Translations,
    ) {}

    public async get(): Promise<MenuItemConstructorOptions[]> {
        const { t } = this.translator.createInstance(this.translations);

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
