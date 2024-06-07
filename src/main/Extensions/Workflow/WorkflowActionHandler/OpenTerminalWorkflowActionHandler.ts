import type { TerminalRegistry } from "@Core/Terminal";
import type { OpenTerminalActionArgs, WorkflowAction } from "@common/Extensions/Workflow";
import type { WorkflowActionHandler } from "./WorkflowActionHandler";

export class OpenTerminalWorkflowActionHandler implements WorkflowActionHandler {
    public constructor(private readonly terminalRegistry: TerminalRegistry) {}

    public async invokeWorkflowAction(workflowAction: WorkflowAction<OpenTerminalActionArgs>): Promise<void> {
        const terminal = this.terminalRegistry.getById(workflowAction.args.terminalId);

        if (!terminal) {
            throw new Error(
                `Unable to invoke workflow action "${workflowAction.name}". Reason: Terminal with id ${workflowAction.args.terminalId} not found`,
            );
        }

        await terminal.launchWithCommand(workflowAction.args.command);
    }
}
