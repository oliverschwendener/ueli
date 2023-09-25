import type { IpcMain, Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import type { EventEmitter } from "../EventEmitter";
import type { CommandlineUtility } from "../Utilities";
import {
    CommandlineExecutionService,
    FilePathExecutionService,
    PowershellExecutionService,
    UrlExecutionService,
} from "./ExecutionServices";
import { Executor } from "./Executor";
import { useExecutor } from "./useExecutor";

describe(useExecutor, () => {
    it("should correctly instantiate the Executor", () => {
        const handleMock = vi.fn();

        const commandlineUtility = <CommandlineUtility>{};
        const shell = <Shell>{};
        const eventEmitter = <EventEmitter>{};

        const ipcMain = <IpcMain>{
            handle: (channel, listener) => handleMock(channel, listener),
        };

        expect(useExecutor({ commandlineUtility, eventEmitter, shell, ipcMain })).toEqual(
            new Executor(
                {
                    FilePath: new FilePathExecutionService(shell),
                    URL: new UrlExecutionService(shell),
                    Powershell: new PowershellExecutionService(commandlineUtility),
                    Commandline: new CommandlineExecutionService(commandlineUtility),
                },
                eventEmitter,
            ),
        );

        expect(handleMock).toHaveBeenCalledOnce();
    });
});
