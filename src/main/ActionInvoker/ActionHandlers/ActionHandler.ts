import type { SearchResultItemAction } from "@common/SearchResultItemAction";

export interface ActionHandler {
    invoke(action: SearchResultItemAction): Promise<void>;
}
