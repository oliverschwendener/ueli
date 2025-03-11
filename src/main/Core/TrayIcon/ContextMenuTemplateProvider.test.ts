import type { SettingsManager } from "@Core/SettingsManager";
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

            const getValueMock = vi.fn().mockReturnValue(true);

            const translator = <Translator>{ createT: createTMock };
            const ueliCommandInvoker = <UeliCommandInvoker>{};
            const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };

            const actual = await new ContextMenuTemplateProvider(
                translator,
                ueliCommandInvoker,
                settingsManager,
                resources,
            ).get();

            const expected: MenuItemConstructorOptions[] = [
                { label: "translation[trayIcon.contextMenu.show]", click: () => null },
                { type: "separator" },
                {
                    label: "translation[trayIcon.contextMenu.hotkey]",
                    click: () => null,
                    checked: true,
                    type: "checkbox",
                    toolTip: "translation[trayIcon.contextMenu.hotkey.tooltip]",
                },
                { label: "translation[trayIcon.contextMenu.settings]", click: () => null },
                { label: "translation[trayIcon.contextMenu.about]", click: () => null },
                { type: "separator" },
                { label: "translation[trayIcon.contextMenu.quit]", click: () => null },
            ];

            expect(createTMock).toHaveBeenCalledWith(resources);
            expect(getValueMock).toHaveBeenCalledWith("general.hotkey.enabled", true);
            expect(JSON.stringify(actual)).toEqual(JSON.stringify(expected));
        });
    });
});
