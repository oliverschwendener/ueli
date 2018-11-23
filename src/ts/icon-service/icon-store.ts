import { ProductionIcon } from "./production-icon";
import { SearchResultItem } from "../search-result-item";

export interface IconStore {
    addIcon(icon: ProductionIcon): void;
    getIcon(iconName: string): ProductionIcon | undefined;
    init(searchResultItems: SearchResultItem[]): void;
}
