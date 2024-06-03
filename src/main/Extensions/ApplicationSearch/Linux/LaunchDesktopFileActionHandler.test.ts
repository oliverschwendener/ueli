import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { LaunchDesktopFileActionHandler } from "./LaunchDesktopFileActionHandler";

describe(LaunchDesktopFileActionHandler, () => {
    it("should call `gio launch` when executing search result item with the argument file name", async () => {
        const executeCommandMock = vi.fn().mockResolvedValue("");
        const commandlineUtility = <CommandlineUtility>{ executeCommand: (path) => executeCommandMock(path) };

        const actionHandler = new LaunchDesktopFileActionHandler(commandlineUtility);

        await actionHandler.invokeAction(<SearchResultItemAction>{
            argument: "/usr/share/applications/firefox.desktop",
        });

        expect(actionHandler.id).toEqual("LaunchDesktopFile");
        expect(executeCommandMock).toHaveBeenCalledWith("gio launch /usr/share/applications/firefox.desktop");
    });

    it("should throw an error if `gio launch` throws an error", async () => {
        const errorMessage = "gio: Unable to load '/usr/share/applications/firefox.desktop': No such file or directory";

        const executeCommandMock = vi.fn().mockRejectedValue(errorMessage);

        const commandlineUtility = <CommandlineUtility>{ executeCommand: (path) => executeCommandMock(path) };

        const actionHandler = new LaunchDesktopFileActionHandler(commandlineUtility);

        await expect(
            actionHandler.invokeAction(<SearchResultItemAction>{ argument: "/usr/share/applications/firefox.desktop" }),
        ).rejects.toThrowError(errorMessage);
    });
});
