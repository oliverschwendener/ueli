import type { Shell } from "electron";
import type { OpenFileWorkflowAction } from "../WorkflowAction";
import type { WorkflowActionHandler } from "./WorkflowActionHandler";

export class OpenFileWorkflowActionHandler implements WorkflowActionHandler<OpenFileWorkflowAction> {
    public constructor(private readonly shell: Shell) {}

    public async invokeWorkflowAction({ filePath }: OpenFileWorkflowAction): Promise<void> {
        await this.shell.openPath(filePath);
    }
}
