import type { Shell } from "electron";
import type { OpenFileActionArgs } from "../WorkflowAction/OpenFileActionArgs";
import type { WorkflowAction } from "../WorkflowAction/WorkflowAction";
import type { WorkflowActionHandler } from "./WorkflowActionHandler";

export class OpenFileWorkflowActionHandler implements WorkflowActionHandler {
    public constructor(private readonly shell: Shell) {}

    public async invokeWorkflowAction(action: WorkflowAction<OpenFileActionArgs>): Promise<void> {
        await this.shell.openPath(action.args.filePath);
    }
}
