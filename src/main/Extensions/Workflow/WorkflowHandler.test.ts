import type { Logger } from "@Core/Logger";
import type { SearchResultItemAction } from "@common/Core";
import type { WorkflowAction } from "@common/Extensions/Workflow";
import { describe, expect, it, vi } from "vitest";
import { WorkflowActionArgumentEncoder } from "./Utility";
import type { WorkflowActionHandler } from "./WorkflowActionHandler";
import { WorkflowHandler } from "./WorkflowHandler";

describe(WorkflowHandler, () => {
    describe(WorkflowHandler.prototype.id, () =>
        it("should be 'Workflow'", () => expect(new WorkflowHandler(null, {}).id).toBe("Workflow")),
    );

    describe(WorkflowHandler.prototype.invokeAction, () => {
        it("should invoke all supported workflow action handlers and log errors", async () => {
            const errorMock = vi.fn();
            const logger = <Logger>{ error: (m) => errorMock(m) };

            const handler1 = <WorkflowActionHandler>{ invokeWorkflowAction: vi.fn().mockResolvedValue(null) };
            const handler2 = <WorkflowActionHandler>{ invokeWorkflowAction: vi.fn().mockRejectedValue("error") };
            const handler4 = <WorkflowActionHandler>{ invokeWorkflowAction: vi.fn() };

            const workflowHandler = new WorkflowHandler(logger, { handler1, handler2, handler4 });

            const workflowAction1 = <WorkflowAction<unknown>>{ args: { arg1: "value1" }, handlerId: "handler1" };
            const workflowAction2 = <WorkflowAction<unknown>>{ args: { arg2: "value2" }, handlerId: "handler2" };
            const workflowAction3 = <WorkflowAction<unknown>>{ args: { arg3: "value3" }, handlerId: "handler3" };

            await workflowHandler.invokeAction(<SearchResultItemAction>{
                argument: WorkflowActionArgumentEncoder.encodeArgument([
                    workflowAction1,
                    workflowAction2,
                    workflowAction3,
                ]),
            });

            expect(handler1.invokeWorkflowAction).toHaveBeenCalledWith(workflowAction1);
            expect(handler2.invokeWorkflowAction).toHaveBeenCalledWith(workflowAction2);
            expect(handler4.invokeWorkflowAction).not.toHaveBeenCalled();

            expect(errorMock).toHaveBeenCalledOnce();
            expect(errorMock).toHaveBeenCalledWith("Unable to invoke workflow action. Reason: error");
        });
    });
});
