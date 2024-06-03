import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { ExecuteCommandActionArgs, WorkflowAction } from "@common/Extensions/Workflow";
import { describe, expect, it, vi } from "vitest";
import { ExecuteCommandWorkflowActionHandler } from "./ExecuteCommandWorkflowActionHandler";

describe(ExecuteCommandWorkflowActionHandler, () => {
    it(ExecuteCommandWorkflowActionHandler.prototype.invokeWorkflowAction, async () => {
        const executeCommandMock = vi.fn();
        const commandlineUtility = <CommandlineUtility>{ executeCommand: (f) => executeCommandMock(f) };

        const workflowAction = <WorkflowAction<ExecuteCommandActionArgs>>{
            handlerId: "ExecuteCommand",
            args: { command: "echo hello" },
        };

        await new ExecuteCommandWorkflowActionHandler(commandlineUtility).invokeWorkflowAction(workflowAction);

        expect(executeCommandMock).toHaveBeenCalledWith(workflowAction.args.command);
    });
});
