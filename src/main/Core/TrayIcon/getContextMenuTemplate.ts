import type { MenuItemConstructorOptions } from "electron";
import type { Translator } from "..";
import type { UeliCommandInvoker } from "../UeliCommand";
import { translations } from "./translations";

export const getContextMenuTemplate = async ({
    translator,
    ueliCommandInvoker,
}: {
    translator: Translator;
    ueliCommandInvoker: UeliCommandInvoker;
}): Promise<MenuItemConstructorOptions[]> => {
    const t = await translator.createInstance(translations);

    return [
        {
            label: t("trayIcon.contextMenu.show"),
            click: () => ueliCommandInvoker.invokeUeliCommand("show"),
        },
        {
            label: t("trayIcon.contextMenu.settings"),
            click: () => ueliCommandInvoker.invokeUeliCommand("openSettings"),
        },
        {
            label: t("trayIcon.contextMenu.about"),
            click: () => ueliCommandInvoker.invokeUeliCommand("openAbout"),
        },
        {
            label: t("trayIcon.contextMenu.quit"),
            click: () => ueliCommandInvoker.invokeUeliCommand("quit"),
        },
    ];
};
