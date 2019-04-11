import { FavoriteRepository } from "./favorite-repository";
import { SearchResultItem } from "../../common/search-result-item";
import { Favorite } from "./favorite";

export class FavoriteManager {
    private readonly favoriteRepository: FavoriteRepository;

    constructor(favoriteRepository: FavoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    public increaseCount(searchResultItem: SearchResultItem): Promise<void> {
        return new Promise((resolve, reject) => {
            const favorite = this.favoriteRepository.get(searchResultItem);
            if (favorite) {
                favorite.executionCount++;
                this.favoriteRepository.update(favorite);
            } else {
                this.favoriteRepository.save({ executionCount: 1, item: searchResultItem });
            }
            resolve();
        });
    }

    public getAllFavorites(): Favorite[] {
        return this.favoriteRepository.getAll();
    }

    public clearExecutionLog(): Promise<void> {
        return this.favoriteRepository.clearAll();
    }
}
