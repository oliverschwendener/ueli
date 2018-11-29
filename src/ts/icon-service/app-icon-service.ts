import { SearchResultItem } from "../search-result-item";
import { AppIconStore } from "./app-icon-store";

export class AppIconService {
    private readonly iconStore: AppIconStore;

    constructor(iconStore: AppIconStore) {
        this.iconStore = iconStore;
    }

    public getProgramIcon(searchResultItem: SearchResultItem ): Promise<SearchResultItem> {
        return new Promise((resolve, reject) => {
            const icon = this.iconStore.getIcon(searchResultItem.name);
            if (icon !== undefined) {
                searchResultItem.icon = `<img src="file://${icon.PNGFilePath}">`;
                resolve(searchResultItem);
            } else {
                resolve(searchResultItem);
            }
        });
    }
}
