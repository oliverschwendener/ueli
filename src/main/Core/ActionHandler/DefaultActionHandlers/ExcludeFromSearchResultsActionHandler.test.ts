import type { ExcludedSearchResults } from "@Core/ExcludedSearchResults";
import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { ExcludeFromSearchResultsActionHandler } from "./ExcludeFromSearchResultsActionHandler";

describe(ExcludeFromSearchResultsActionHandler, () => {
    it("should correctly invoke action", async () => {
        const excludeItemMock = vi.fn();
        const excludedSearchResults = <ExcludedSearchResults>{ add: (item) => excludeItemMock(item) };

        const actionHandler = new ExcludeFromSearchResultsActionHandler(excludedSearchResults);

        await actionHandler.invokeAction(<SearchResultItemAction>{ argument: "item1" });

        expect(actionHandler.id).toBe("excludeFromSearchResults");
        expect(excludeItemMock).toHaveBeenCalledWith("item1");
    });
});
