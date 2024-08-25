import type { ActionHandler } from "@Core/ActionHandler";
import type { SearchResultItemAction } from "@common/Core";
import type { FavoriteManager } from "../FavoriteManager";

/**
 * Action handler for adding and removing favorites.
 */
export class FavoritesActionHandler implements ActionHandler {
    public readonly id = "Favorites";

    public constructor(private readonly favoriteManager: FavoriteManager) {}

    /**
     * Adds or removes the given favorite.
     * Expects the given action's argument to be a JSON string with the following structure:
     * ```json
     * {
     *   "action": "Add" | "Remove",
     *   "id": <FavoriteId(string)>
     * }
     * ```
     */
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
