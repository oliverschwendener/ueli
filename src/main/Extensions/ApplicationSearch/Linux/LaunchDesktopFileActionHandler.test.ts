import type { CommandlineUtility } from "@Core/CommandlineUtility";
import { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { LaunchDesktopFileActionHandler } from "./LaunchDesktopFileActionHandler";

describe(LaunchDesktopFileActionHandler, () => {
    it("should call `gio launch` when executing search result item with the argument file name on GNOME", async () => {
        const executeCommandMock = vi.fn().mockReturnValue(Promise.resolve(""));
        const commandlineUtility = <CommandlineUtility>{ executeCommand: (path) => executeCommandMock(path) };

        const getEnvMock = vi.fn().mockReturnValue("GNOME");
        const getAllEnvMock = vi.fn().mockReturnValue({ XDG_CURRENT_DESKTOP: "GNOME" });
        const environmentVariableProvider = <EnvironmentVariableProvider>{
            get: getEnvMock,
            getAll: getAllEnvMock,
        };

        const actionHandler = new LaunchDesktopFileActionHandler(commandlineUtility, environmentVariableProvider);

        await actionHandler.invokeAction(<SearchResultItemAction>{
            argument: "/usr/share/applications/firefox.desktop",
        });

        expect(actionHandler.id).toEqual("LaunchDesktopFile");
        expect(executeCommandMock).toHaveBeenCalledWith("gio launch /usr/share/applications/firefox.desktop");
    });

    it("should call `kde-open` when executing search result item with the argument file name on KDE", async () => {
        const executeCommandMock = vi.fn().mockReturnValue(Promise.resolve(""));
        const commandlineUtility = <CommandlineUtility>{ executeCommand: (path) => executeCommandMock(path) };

        const getEnvMock = vi.fn().mockReturnValue("KDE");
        const getAllEnvMock = vi.fn().mockReturnValue({ XDG_CURRENT_DESKTOP: "KDE" });
        const environmentVariableProvider = <EnvironmentVariableProvider>{
            get: getEnvMock,
            getAll: getAllEnvMock,
        };

        const actionHandler = new LaunchDesktopFileActionHandler(commandlineUtility, environmentVariableProvider);

        await actionHandler.invokeAction(<SearchResultItemAction>{
            argument: "/usr/share/applications/firefox.desktop",
        });

        expect(actionHandler.id).toEqual("LaunchDesktopFile");
        expect(executeCommandMock).toHaveBeenCalledWith("kde-open /usr/share/applications/firefox.desktop");
    });

    it("should use the first desktop environment compatible found when provided with multiple options", async () => {
        const executeCommandMock = vi.fn().mockReturnValue(Promise.resolve(""));
        const commandlineUtility = <CommandlineUtility>{ executeCommand: (path) => executeCommandMock(path) };

        const getEnvMock = vi.fn().mockReturnValue("ubuntu:GNOME:XFCE:KDE");
        const getAllEnvMock = vi.fn().mockReturnValue({ XDG_CURRENT_DESKTOP: "GNOME:XFCE:KDE" });
        const environmentVariableProvider = <EnvironmentVariableProvider>{
            get: getEnvMock,
            getAll: getAllEnvMock,
        };

        const actionHandler = new LaunchDesktopFileActionHandler(commandlineUtility, environmentVariableProvider);

        await actionHandler.invokeAction(<SearchResultItemAction>{
            argument: "/usr/share/applications/firefox.desktop",
        });

        expect(actionHandler.id).toEqual("LaunchDesktopFile");
        expect(executeCommandMock).toHaveBeenCalledWith("gio launch /usr/share/applications/firefox.desktop");
    });

    it("should throw an error if `gio launch` throws an error", async () => {
        const executeCommandMock = vi
            .fn()
            .mockReturnValue(
                Promise.reject(
                    "gio: Unable to load '/usr/share/applications/firefox.desktop': No such file or directory",
                ),
            );
        const commandlineUtility = <CommandlineUtility>{ executeCommand: (path) => executeCommandMock(path) };

        const getEnvMock = vi.fn().mockReturnValue("GNOME");
        const getAllEnvMock = vi.fn().mockReturnValue({ XDG_CURRENT_DESKTOP: "GNOME" });
        const environmentVariableProvider = <EnvironmentVariableProvider>{
            get: getEnvMock,
            getAll: getAllEnvMock,
        };

        const actionHandler = new LaunchDesktopFileActionHandler(commandlineUtility, environmentVariableProvider);

        await expect(
            actionHandler.invokeAction(<SearchResultItemAction>{ argument: "/usr/share/applications/firefox.desktop" }),
        ).rejects.toThrowError(
            "gio: Unable to load '/usr/share/applications/firefox.desktop': No such file or directory",
        );
    });
});
