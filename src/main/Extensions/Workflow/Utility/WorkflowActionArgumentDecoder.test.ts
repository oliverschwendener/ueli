import type { WorkflowAction } from "@common/Extensions/Workflow";
import { describe, expect, it } from "vitest";
import { WorkflowActionArgumentDecoder } from "./WorkflowActionArgumentDecoder";

describe(WorkflowActionArgumentDecoder, () => {
    describe(WorkflowActionArgumentDecoder.decodeArgument, () => {
        it("should JSON decode the given string to a list of workflow actions", () => {
            const workflowActions = <WorkflowAction<unknown>[]>[
                { handlerId: "handler1", args: { prop1: "prop1" } },
                { handlerId: "handler2", args: { prop2: "prop2" } },
            ];

            expect(WorkflowActionArgumentDecoder.decodeArgument(JSON.stringify(workflowActions))).toEqual(
                workflowActions,
            );
        });
    });
});
