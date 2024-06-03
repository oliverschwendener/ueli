import type { OpenUrlActionArgs, WorkflowAction } from "@common/Extensions/Workflow";
import type { Shell } from "electron";
import { describe, expect, it, vi } from "vitest";
import { OpenUrlWorkflowActionHandler } from "./OpenUrlWorkflowActionHandler";

describe(OpenUrlWorkflowActionHandler, () => {
    it(OpenUrlWorkflowActionHandler.prototype.invokeWorkflowAction, async () => {
        const openExternalMock = vi.fn();
        const shell = <Shell>{ openExternal: (f) => openExternalMock(f) };

        const handler = new OpenUrlWorkflowActionHandler(shell);

        const workflowAction = <WorkflowAction<OpenUrlActionArgs>>{
            handlerId: "OpenUrl",
            args: { url: "https://example.com" },
        };

        await handler.invokeWorkflowAction(workflowAction);

        expect(openExternalMock).toHaveBeenCalledWith(workflowAction.args.url);
    });
});
