import type { FavoriteManager } from "@Core/FavoriteManager";
import type { SearchResultItemAction } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { FavoritesActionHandler } from "./FavoritesActionHandler";

describe(FavoritesActionHandler, () => {
    it("should add an item to favorites", async () => {
        const addMock = vi.fn().mockReturnValue(Promise.resolve());
        const favoriteManager = <FavoriteManager>{ add: (f) => addMock(f) };

        const actionHandler = new FavoritesActionHandler(favoriteManager);

        expect(actionHandler.id).toEqual("Favorites");

        await actionHandler.invokeAction(<SearchResultItemAction>{
            argument: JSON.stringify({
                action: "Add",
                id: "id_1",
            }),
        });

        expect(addMock).toHaveBeenCalledWith("id_1");
    });

    it("should remove an item from the favorites", async () => {
        const removeMock = vi.fn().mockReturnValue(Promise.resolve());
        const favoriteManager = <FavoriteManager>{ remove: (id) => removeMock(id) };

        const actionHandler = new FavoritesActionHandler(favoriteManager);

        await actionHandler.invokeAction(<SearchResultItemAction>{
            argument: JSON.stringify({
                action: "Remove",
                id: "id_1",
            }),
        });

        expect(removeMock).toHaveBeenCalledWith("id_1");
    });

    it("should throw an error if the action is unexpected", async () => {
        const actionHandler = new FavoritesActionHandler(<FavoriteManager>{});

        await expect(
            actionHandler.invokeAction(<SearchResultItemAction>{ argument: JSON.stringify({ action: "Update" }) }),
        ).rejects.toThrowError("Unexpected action: Update");
    });
});
