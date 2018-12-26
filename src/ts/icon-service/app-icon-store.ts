import { ApplicationIcon } from "./application-icon";
import { SearchResultItem } from "../search-result-item";

export interface AppIconStore {
    addIcon(icon: ApplicationIcon): void;
    getIcon(iconName: string): ApplicationIcon | undefined;
    init(searchResultItems: SearchResultItem[]): void;
    clearCache(): void;
}
