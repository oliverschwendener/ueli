import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { GtkLaunchActionHandler } from "./GtkLaunchActionHandler";

describe(GtkLaunchActionHandler, () => {
    it("should call `gtk-launch` when executing search result item with the argument file name", async () => {
        const executeCommandMock = vi.fn().mockReturnValue(Promise.resolve(""));
        const commandlineUtility = <CommandlineUtility>{ executeCommand: (path) => executeCommandMock(path) };

        const actionHandler = new GtkLaunchActionHandler(commandlineUtility);

        await actionHandler.invokeAction(<SearchResultItemAction>{
            argument: "/usr/share/applications/firefox.desktop",
        });

        expect(actionHandler.id).toEqual("GtkLaunch");
        expect(executeCommandMock).toHaveBeenCalledWith("gtk-launch firefox.desktop");
    });

    it("should throw an error if `gtk-launch` throws an error", async () => {
        const executeCommandMock = vi
            .fn()
            .mockReturnValue(Promise.reject("gtk-launch: no such application as firefox"));
        const commandlineUtility = <CommandlineUtility>{ executeCommand: (path) => executeCommandMock(path) };

        const actionHandler = new GtkLaunchActionHandler(commandlineUtility);

        await expect(
            actionHandler.invokeAction(<SearchResultItemAction>{ argument: "/usr/share/applications/firefox.desktop" }),
        ).rejects.toThrowError("gtk-launch: no such application as firefox");
    });
});
