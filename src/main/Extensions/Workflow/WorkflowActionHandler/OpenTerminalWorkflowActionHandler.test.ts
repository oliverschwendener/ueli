import type { Terminal, TerminalRegistry } from "@Core/Terminal";
import type { OpenTerminalActionArgs, WorkflowAction } from "@common/Extensions/Workflow";
import { describe, expect, it, vi } from "vitest";
import { OpenTerminalWorkflowActionHandler } from "./OpenTerminalWorkflowActionHandler";

describe(OpenTerminalWorkflowActionHandler, () => {
    describe(OpenTerminalWorkflowActionHandler.prototype.invokeWorkflowAction, () => {
        it("should launch the given terminal with the given command if the terminal is found", () => {
            const launchWithCommandMock = vi.fn();
            const terminal = <Terminal>{ launchWithCommand: (c) => launchWithCommandMock(c) };
            const getByIdMock = vi.fn().mockReturnValue(terminal);
            const terminalRegistry = <TerminalRegistry>{ getById: (t) => getByIdMock(t) };

            const workflowAction = <WorkflowAction<OpenTerminalActionArgs>>{
                args: {
                    terminalId: "terminal1",
                    command: "my command",
                },
            };

            new OpenTerminalWorkflowActionHandler(terminalRegistry).invokeWorkflowAction(workflowAction);

            expect(getByIdMock).toHaveBeenCalledOnce();
            expect(getByIdMock).toHaveBeenCalledWith("terminal1");

            expect(launchWithCommandMock).toHaveBeenCalledOnce();
            expect(launchWithCommandMock).toHaveBeenCalledWith("my command");
        });
    });
});
