import { FavoriteRepository } from "./favorite-repository";
import { SearchResultItem } from "../../common/search-result-item";
import { Favorite } from "./favorite";
import { getNoFavoritesSearchResult } from "./no-favorites-search-result";
import { TranslationSet } from "../../common/translation/translation-set";

export class FavoriteManager {
    private readonly favoriteRepository: FavoriteRepository;
    private translationSet: TranslationSet;

    constructor(favoriteRepository: FavoriteRepository, translationSet: TranslationSet) {
        this.favoriteRepository = favoriteRepository;
        this.translationSet = translationSet;
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
        const all = this.favoriteRepository.getAll();
        return all.length > 0
            ? all
            : [
                  {
                      executionCount: 1,
                      item: getNoFavoritesSearchResult(this.translationSet),
                  },
              ];
    }

    public clearExecutionLog(): Promise<void> {
        return this.favoriteRepository.clearAll();
    }

    public updateTranslationSet(translationSet: TranslationSet) {
        this.translationSet = translationSet;
    }
}
