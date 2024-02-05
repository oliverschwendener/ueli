import type { FavoriteManager } from "@Core/FavoriteManager";
import type { SearchResultItemAction } from "@common/Core";
import type { ActionHandler } from "../Contract";

export class FavoritesActionHandler implements ActionHandler {
    public readonly id = "Favorites";

    public constructor(private readonly favoriteManager: FavoriteManager) {}

    public async invokeAction({ argument }: SearchResultItemAction): Promise<void> {
        const { action, id } = JSON.parse(argument) as { action: "Add" | "Remove"; id: string };

        if (action === "Add") {
            await this.favoriteManager.add(id);
        } else if (action === "Remove") {
            await this.favoriteManager.remove(id);
        } else {
            throw new Error(`Unexpected action: ${action}`);
        }
    }
}
