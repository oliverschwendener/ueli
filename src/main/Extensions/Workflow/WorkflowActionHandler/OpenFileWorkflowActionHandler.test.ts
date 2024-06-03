import type { OpenFileActionArgs, WorkflowAction } from "@common/Extensions/Workflow";
import type { Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import { OpenFileWorkflowActionHandler } from "./OpenFileWorkflowActionHandler";

describe(OpenFileWorkflowActionHandler, () => {
    describe(OpenFileWorkflowActionHandler.prototype.invokeWorkflowAction, () => {
        it("should open the file", async () => {
            const openPathMock = vi.fn();
            const shell = <Shell>{ openPath: (f) => openPathMock(f) };

            const handler = new OpenFileWorkflowActionHandler(shell);

            const workflowAction = <WorkflowAction<OpenFileActionArgs>>{
                handlerId: "OpenFile",
                args: { filePath: "test.txt" },
            };

            await handler.invokeWorkflowAction(workflowAction);

            expect(openPathMock).toHaveBeenCalledWith(workflowAction.args.filePath);
        });
    });
});
