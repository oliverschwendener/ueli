import type { WorkflowAction } from "@common/Extensions/Workflow";
import { describe, expect, it } from "vitest";
import { WorkflowActionArgumentEncoder } from "./WorkflowActionArgumentEncoder";

describe(WorkflowActionArgumentEncoder, () => {
    describe(WorkflowActionArgumentEncoder.encodeArgument, () => {
        it("should JSON encode the given workflow actions to a string", () => {
            const workflowActions = <WorkflowAction<unknown>[]>[
                { handlerId: "handler1", args: { prop1: "prop1" }, id: "1", name: "name1" },
                { handlerId: "handler2", args: { prop2: "prop2" }, id: "2", name: "name2" },
                { handlerId: "handler3", args: { prop3: "prop3" }, id: "3", name: "name3" },
            ];

            expect(WorkflowActionArgumentEncoder.encodeArgument(workflowActions)).toEqual(
                JSON.stringify(workflowActions),
            );
        });
    });
});
