import type { Translator } from "@Core/Translator";
import type { UeliCommandInvoker } from "@Core/UeliCommand";
import { MenuItemConstructorOptions } from "electron";
import { describe, expect, it, vi } from "vitest";
import { getContextMenuTemplate } from "./getContextMenuTemplate";
import { translations } from "./translations";

describe(getContextMenuTemplate, () => {
    it("should do something", async () => {
        const createInstanceMock = vi.fn().mockResolvedValue((key: string) => `translation[${key}]`);
        const translator = <Translator>{ createInstance: (resources) => createInstanceMock(resources) };
        const ueliCommandInvoker = <UeliCommandInvoker>{};

        const actual = await getContextMenuTemplate({ translator, ueliCommandInvoker });

        const expected: MenuItemConstructorOptions[] = [
            { label: "translation[trayIcon.contextMenu.show]", click: () => null },
            { label: "translation[trayIcon.contextMenu.settings]", click: () => null },
            { label: "translation[trayIcon.contextMenu.about]", click: () => null },
            { label: "translation[trayIcon.contextMenu.quit]", click: () => null },
        ];

        expect(createInstanceMock).toHaveBeenCalledWith(translations);
        expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
    });
});
