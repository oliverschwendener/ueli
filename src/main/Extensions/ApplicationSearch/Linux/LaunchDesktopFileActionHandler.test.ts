import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { LaunchDesktopFileActionHandler } from "./LaunchDesktopFileActionHandler";

describe(LaunchDesktopFileActionHandler, () => {
    it("should call `gio launch` when executing search result item with the argument file name on GNOME", async () => {
        const executeCommandMock = vi.fn().mockResolvedValue("");
        const commandlineUtility = <CommandlineUtility>{ executeCommand: (path) => executeCommandMock(path) };

        const environmentVariableProvider = <EnvironmentVariableProvider>{
            get: () => "GNOME",
            getAll: () => ({}),
        };

        const actionHandler = new LaunchDesktopFileActionHandler(commandlineUtility, environmentVariableProvider);

        await actionHandler.invokeAction(<SearchResultItemAction>{
            argument: "/usr/share/applications/firefox.desktop",
        });

        expect(actionHandler.id).toEqual("LaunchDesktopFile");
        expect(executeCommandMock).toHaveBeenCalledWith("gio launch /usr/share/applications/firefox.desktop");
    });

    it("should call `kde-open` when executing search result item with the argument file name on KDE", async () => {
        const executeCommandMock = vi.fn().mockResolvedValue("");
        const commandlineUtility = <CommandlineUtility>{ executeCommand: (path) => executeCommandMock(path) };

        const environmentVariableProvider = <EnvironmentVariableProvider>{
            get: () => "KDE",
            getAll: () => ({}),
        };

        const actionHandler = new LaunchDesktopFileActionHandler(commandlineUtility, environmentVariableProvider);

        await actionHandler.invokeAction(<SearchResultItemAction>{
            argument: "/usr/share/applications/firefox.desktop",
        });

        expect(actionHandler.id).toEqual("LaunchDesktopFile");
        expect(executeCommandMock).toHaveBeenCalledWith("kde-open /usr/share/applications/firefox.desktop");
    });

    it("should use the first desktop environment compatible found when provided with multiple options", async () => {
        const executeCommandMock = vi.fn().mockResolvedValue("");
        const commandlineUtility = <CommandlineUtility>{ executeCommand: (path) => executeCommandMock(path) };

        const environmentVariableProvider = <EnvironmentVariableProvider>{
            get: () => "ubuntu:GNOME:XFCE:KDE",
            getAll: () => ({}),
        };

        const actionHandler = new LaunchDesktopFileActionHandler(commandlineUtility, environmentVariableProvider);

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

        const environmentVariableProvider = <EnvironmentVariableProvider>{
            get: () => "GNOME",
            getAll: () => ({}),
        };

        const actionHandler = new LaunchDesktopFileActionHandler(commandlineUtility, environmentVariableProvider);

        await expect(
            actionHandler.invokeAction(<SearchResultItemAction>{ argument: "/usr/share/applications/firefox.desktop" }),
        ).rejects.toThrowError(errorMessage);
    });
});
