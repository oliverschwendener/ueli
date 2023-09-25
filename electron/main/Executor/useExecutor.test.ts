import type { Shell } from "electron";
import { describe, expect, it } from "vitest";
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
        const commandlineUtility = <CommandlineUtility>{};
        const shell = <Shell>{};
        const eventEmitter = <EventEmitter>{};

        expect(useExecutor({ commandlineUtility, eventEmitter, shell })).toEqual(
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
    });
});
