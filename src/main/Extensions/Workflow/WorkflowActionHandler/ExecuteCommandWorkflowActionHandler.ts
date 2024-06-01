import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { ExecuteCommandWorkflowAction } from "../WorkflowAction";
import type { WorkflowActionHandler } from "./WorkflowActionHandler";

export class ExecuteCommandWorkflowActionHandler implements WorkflowActionHandler<ExecuteCommandWorkflowAction> {
    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public async invokeWorkflowAction({ command }: ExecuteCommandWorkflowAction): Promise<void> {
        await this.commandlineUtility.executeCommand(command);
    }
}
