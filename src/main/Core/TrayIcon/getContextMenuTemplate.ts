import type { MenuItemConstructorOptions } from "electron";
import { init } from "i18next";
import type { UeliCommandInvoker } from "../UeliCommand";
import { resources } from "./resources";

export const getContextMenuTemplate = async ({
    language: lng,
    ueliCommandInvoker,
}: {
    language: string;
    ueliCommandInvoker: UeliCommandInvoker;
}): Promise<MenuItemConstructorOptions[]> => {
    const t = await init({ resources, lng });

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
