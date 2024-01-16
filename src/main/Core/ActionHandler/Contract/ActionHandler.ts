import type { SearchResultItemAction } from "@common/Core";

export interface ActionHandler {
    readonly id: string;
    invokeAction(action: SearchResultItemAction): Promise<void>;
}
