import type { SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { WorkflowAction } from "./WorkflowAction";
import { WorkflowActionArgumentEncoder } from "./WorkflowActionArgumentEncoder";

export class Workflow {
    public constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly actions: WorkflowAction[],
    ) {}

    public toSearchResultItem(image: Image): SearchResultItem {
        return {
            defaultAction: {
                argument: WorkflowActionArgumentEncoder.encodeArgument(this.actions),
                description: "Invoke workflow",
                handlerId: "Workflow",
            },
            description: "Workflow",
            id: this.id,
            image,
            name: this.name,
        };
    }
}
