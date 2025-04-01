import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { UeliCommandInvoker } from "@Core/UeliCommand";
import type { Resources } from "@common/Core/Translator";
import type { MenuItemConstructorOptions } from "electron";
import type { TrayIconTranslations } from "./TrayIconTranslations";

export class ContextMenuTemplateProvider {
    public constructor(
        private readonly translator: Translator,
        private readonly ueliCommandInvoker: UeliCommandInvoker,
        private readonly settingsManager: SettingsManager,
        private readonly resources: Resources<TrayIconTranslations>,
    ) {}

    public async get(): Promise<MenuItemConstructorOptions[]> {
        const { t } = this.translator.createT(this.resources);

        const hotkeyEnabled = this.settingsManager.getValue("general.hotkey.enabled", true);

        return [
            {
                label: t("trayIcon.contextMenu.show"),
                click: () => this.ueliCommandInvoker.invokeUeliCommand("show"),
            },
            {
                type: "separator",
            },
            {
                label: t("trayIcon.contextMenu.hotkey"),
                checked: hotkeyEnabled,
                type: "checkbox",
                toolTip: t("trayIcon.contextMenu.hotkey.tooltip"),
                click: () =>
                    hotkeyEnabled
                        ? this.ueliCommandInvoker.invokeUeliCommand("disableHotkey")
                        : this.ueliCommandInvoker.invokeUeliCommand("enableHotkey"),
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
                type: "separator",
            },
            {
                label: t("trayIcon.contextMenu.quit"),
                click: () => this.ueliCommandInvoker.invokeUeliCommand("quit"),
            },
        ];
    }
}
