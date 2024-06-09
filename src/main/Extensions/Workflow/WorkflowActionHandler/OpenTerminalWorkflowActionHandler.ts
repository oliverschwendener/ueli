import type { TerminalRegistry } from "@Core/Terminal";
import type { OpenTerminalActionArgs, WorkflowAction } from "@common/Extensions/Workflow";
import type { WorkflowActionHandler } from "./WorkflowActionHandler";

export class OpenTerminalWorkflowActionHandler implements WorkflowActionHandler {
    public constructor(private readonly terminalRegistry: TerminalRegistry) {}

    public async invokeWorkflowAction(workflowAction: WorkflowAction<OpenTerminalActionArgs>): Promise<void> {
        await this.terminalRegistry
            .getById(workflowAction.args.terminalId)
            .launchWithCommand(workflowAction.args.command);
    }
}
