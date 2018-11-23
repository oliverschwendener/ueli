import { ApplicationIcon } from "./application-icon";
import { SearchResultItem } from "../search-result-item";

export interface IconStore {
    addIcon(icon: ApplicationIcon): void;
    getIcon(iconName: string): ApplicationIcon | undefined;
    init(searchResultItems: SearchResultItem[]): void;
}
