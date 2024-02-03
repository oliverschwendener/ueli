import type { FavoriteManager } from "@Core/FavoriteManager";
import type { SearchResultItem, SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { FavoritesActionHandler } from "./FavoritesActionHandler";

describe(FavoritesActionHandler, () => {
    it("should add an item to favorites", async () => {
        const addMock = vi.fn().mockReturnValue(Promise.resolve());
        const favoriteManager = <FavoriteManager>{ add: (f) => addMock(f) };

        const actionHandler = new FavoritesActionHandler(favoriteManager);

        const favorite = <SearchResultItem>{
            id: "myId",
            imageUrl: "myImageUrl",
            name: "myName",
        };

        expect(actionHandler.id).toEqual("Favorites");

        await actionHandler.invokeAction(<SearchResultItemAction>{
            argument: JSON.stringify({
                action: "Add",
                data: favorite,
            }),
        });

        expect(addMock).toHaveBeenCalledWith(favorite);
    });

    it("should remove an item from the favorites", async () => {
        const removeMock = vi.fn().mockReturnValue(Promise.resolve());
        const favoriteManager = <FavoriteManager>{ remove: (id) => removeMock(id) };

        const actionHandler = new FavoritesActionHandler(favoriteManager);

        await actionHandler.invokeAction(<SearchResultItemAction>{
            argument: JSON.stringify({
                action: "Remove",
                data: "someId",
            }),
        });

        expect(removeMock).toHaveBeenCalledWith("someId");
    });

    it("should throw an error if the action is unexpected", async () => {
        const favoriteManager = <FavoriteManager>{};
        const actionHandler = new FavoritesActionHandler(favoriteManager);

        await expect(
            actionHandler.invokeAction(<SearchResultItemAction>{
                argument: JSON.stringify({
                    action: "Update",
                    data: {},
                }),
            }),
        ).rejects.toThrowError("Unexpected action: Update");
    });
});
