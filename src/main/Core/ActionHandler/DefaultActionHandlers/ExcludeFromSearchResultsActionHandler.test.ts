import { ExcludedSearchResults } from "@Core/ExcludedSearchResults";
import { ExcludedSearchResultItem, SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { ExcludeFromSearchResultsActionHandler } from "./ExcludeFromSearchResultsActionHandler";

describe(ExcludeFromSearchResultsActionHandler, () => {
    it("should have the correct id", () => {
        expect(new ExcludeFromSearchResultsActionHandler(<ExcludedSearchResults>{}).id).toBe(
            "excludeFromSearchResults",
        );
    });

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

        expect(excludeItemMock).toHaveBeenCalledWith(item);
    });
});
