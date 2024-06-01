import type { Shell } from "electron";
import type { OpenUrlActionArgs, WorkflowAction } from "../WorkflowAction";
import type { WorkflowActionHandler } from "./WorkflowActionHandler";

export class OpenUrlWorkflowActionHandler implements WorkflowActionHandler {
    public constructor(private readonly shell: Shell) {}

    public async invokeWorkflowAction(action: WorkflowAction<OpenUrlActionArgs>): Promise<void> {
        await this.shell.openExternal(action.args.url);
    }
}
