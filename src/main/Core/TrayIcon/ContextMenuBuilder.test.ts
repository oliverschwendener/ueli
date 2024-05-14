import type { Menu, MenuItemConstructorOptions } from "electron";
import { describe, expect, it, vi } from "vitest";
import { ContextMenuBuilder } from "./ContextMenuBuilder";

const menuDummy = <Menu>{ items: [] };
const buildFromTemplateMock = vi.fn().mockReturnValue(menuDummy);

vi.mock("electron", () => {
    return {
        Menu: {
            buildFromTemplate: (t: MenuItemConstructorOptions[]) => buildFromTemplateMock(t),
        },
    };
});

describe(ContextMenuBuilder, () => {
    describe(ContextMenuBuilder.prototype.buildFromTemplate, () => {
        it("should use Electron's Menu.buildFromTemplate method to build the template", () => {
            const template = [
                { label: "test-label-1", click: () => null },
                { label: "test-label-2", click: () => null },
            ];

            expect(new ContextMenuBuilder().buildFromTemplate(template)).toBe(menuDummy);
            expect(buildFromTemplateMock).toHaveBeenCalledWith(template);
        });
    });
});
