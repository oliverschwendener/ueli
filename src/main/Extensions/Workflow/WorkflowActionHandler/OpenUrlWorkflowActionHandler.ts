import type { Shell } from "electron";
import type { OpenUrlWorkflowAction } from "../WorkflowAction";
import type { WorkflowActionHandler } from "./WorkflowActionHandler";

export class OpenUrlWorkflowActionHandler implements WorkflowActionHandler<OpenUrlWorkflowAction> {
    public constructor(private readonly shell: Shell) {}

    public async invokeWorkflowAction({ url }: OpenUrlWorkflowAction): Promise<void> {
        await this.shell.openExternal(url);
    }
}
