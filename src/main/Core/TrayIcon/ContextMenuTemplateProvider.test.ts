import type { Translator } from "@Core/Translator";
import type { UeliCommandInvoker } from "@Core/UeliCommand";
import type { MenuItemConstructorOptions } from "electron";
import { describe, expect, it, vi } from "vitest";
import { ContextMenuTemplateProvider } from "./ContextMenuTemplateProvider";
import { resources } from "./resources";

describe(ContextMenuTemplateProvider, () => {
    describe(ContextMenuTemplateProvider.prototype.get, () => {
        it("should return context menu template with translations", async () => {
            const t = (key: string) => `translation[${key}]`;
            const createTMock = vi.fn().mockReturnValue({ t });
            const translator = <Translator>{ createT: createTMock };
            const ueliCommandInvoker = <UeliCommandInvoker>{};

            const actual = await new ContextMenuTemplateProvider(translator, ueliCommandInvoker, resources).get();

            const expected: MenuItemConstructorOptions[] = [
                { label: "translation[trayIcon.contextMenu.show]", click: () => null },
                { label: "translation[trayIcon.contextMenu.settings]", click: () => null },
                { label: "translation[trayIcon.contextMenu.about]", click: () => null },
                { label: "translation[trayIcon.contextMenu.quit]", click: () => null },
            ];

            expect(createTMock).toHaveBeenCalledWith(resources);
            expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
        });
    });
});
