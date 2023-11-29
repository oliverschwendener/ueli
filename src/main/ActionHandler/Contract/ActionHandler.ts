import type { SearchResultItemAction } from "@common/SearchResultItemAction";

export interface ActionHandler {
    readonly id: string;
    invokeAction(action: SearchResultItemAction): Promise<void>;
}
