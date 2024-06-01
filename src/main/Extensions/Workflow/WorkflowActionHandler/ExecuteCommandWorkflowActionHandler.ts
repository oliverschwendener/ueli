import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { ExecuteCommandActionArgs, WorkflowAction } from "../WorkflowAction";
import type { WorkflowActionHandler } from "./WorkflowActionHandler";

export class ExecuteCommandWorkflowActionHandler implements WorkflowActionHandler {
    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public async invokeWorkflowAction(action: WorkflowAction<ExecuteCommandActionArgs>): Promise<void> {
        await this.commandlineUtility.executeCommand(action.args.command);
    }
}
