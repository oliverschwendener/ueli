import type { ExcludedSearchResults } from "@Core/ExcludedSearchResults";
import type { ExcludedSearchResultItem, SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { ExcludeFromSearchResultsActionHandler } from "./ExcludeFromSearchResultsActionHandler";

describe(ExcludeFromSearchResultsActionHandler, () => {
    it("should correctly invoke action", async () => {
        const excludeItemMock = vi.fn();
        const excludedSearchResults = <ExcludedSearchResults>{ addItem: (item) => excludeItemMock(item) };

        const actionHandler = new ExcludeFromSearchResultsActionHandler(excludedSearchResults);

        const item: ExcludedSearchResultItem = {
            id: "itemId",
            name: "Item Name",
            imageUrl: "file:///myImage.png",
        };

        await actionHandler.invokeAction(<SearchResultItemAction>{ argument: JSON.stringify(item) });

        expect(actionHandler.id).toBe("excludeFromSearchResults");
        expect(excludeItemMock).toHaveBeenCalledWith(item);
    });
});
