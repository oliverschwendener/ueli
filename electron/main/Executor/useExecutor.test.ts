import { Shell } from "electron";
import { describe, expect, it } from "vitest";
import { EventEmitter } from "../EventEmitter";
import { FilePathExecutionService, UrlExecutionService } from "./ExecutionServices";
import { Executor } from "./Executor";
import { useExecutor } from "./useExecutor";

describe(useExecutor, () => {
    it("should correctly instantiate the Executor", () => {
        const shell = <Shell>{};
        const eventEmitter = <EventEmitter>{};

        expect(useExecutor({ shell, eventEmitter })).toEqual(
            new Executor(
                {
                    FilePath: new FilePathExecutionService(shell),
                    URL: new UrlExecutionService(shell),
                },
                eventEmitter,
            ),
        );
    });
});
