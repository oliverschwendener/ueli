import type { SearchResultItemAction } from "@common/SearchResultItemAction";

export interface ActionHandler {
    readonly id: string;
    invoke(action: SearchResultItemAction): Promise<void>;
}
