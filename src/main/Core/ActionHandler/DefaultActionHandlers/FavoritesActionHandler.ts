import type { FavoriteManager } from "@Core/FavoriteManager";
import type { SearchResultItem, SearchResultItemAction } from "@common/Core";
import type { ActionHandler } from "../Contract";

export class FavoritesActionHandler implements ActionHandler {
    public readonly id = "Favorites";

    public constructor(private readonly favoriteManager: FavoriteManager) {}

    public async invokeAction({ argument }: SearchResultItemAction): Promise<void> {
        const { action, data } = JSON.parse(argument) as { action: "Add" | "Remove"; data: unknown };

        if (action === "Add") {
            await this.favoriteManager.add(data as SearchResultItem);
        } else if (action === "Remove") {
            await this.favoriteManager.remove(data as string);
        } else {
            throw new Error(`Unexpected action: ${action}`);
        }
    }
}
