import { SearchResultItem } from "../search-result-item";
import { IconSet } from "../icon-sets/icon-set";
import { IconStore } from "./icon-store";

export class ProductionIconService {
    private readonly iconStore: IconStore;

    constructor(iconStore: IconStore) {
        this.iconStore = iconStore;
    }

    public getProgramIcon(iconSet: IconSet, searchResultItem: SearchResultItem ): Promise<SearchResultItem> {
        return new Promise((resolve, reject) => {
            const icon = this.iconStore.getIcon(searchResultItem.name);
            if (icon !== undefined) {
                searchResultItem.icon = `<img src="data:image/png;base64,${icon.base64Icon}">`;
                resolve(searchResultItem);
            } else {
                resolve(searchResultItem);
            }
        });
    }
}
