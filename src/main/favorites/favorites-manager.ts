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

    public increaseCount(userInput: string, searchResultItem: SearchResultItem): Promise<void> {
        return new Promise((resolve) => {
            const favorite = this.favoriteRepository.get(searchResultItem);
            if (favorite) {
                favorite.executionCount++;
                if (!favorite.keyword) favorite.keyword = {};
                if (!favorite.keyword[userInput]) favorite.keyword[userInput] = 0;
                favorite.keyword[userInput]++;
                this.favoriteRepository.update(favorite);
            } else {
                this.favoriteRepository.save({ executionCount: 1, item: searchResultItem, keyword: {} });
            }
            resolve();
        });
    }

    public getAllFavorites(): Favorite[] {
        const all = this.favoriteRepository.getAll();
        if (all.length > 0) return all;
        return [
            {
                executionCount: 1,
                item: getNoFavoritesSearchResult(this.translationSet),
                keyword: {},
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
