import { IconStore } from "../../ts/icon-service/icon-store";
import { ProductionIcon } from "../../ts/icon-service/production-icon";
import { SearchResultItem } from "../../ts/search-result-item";

export class FakeIconStore implements IconStore {
    public hasBeenInitialized = false;
    private readonly icons: ProductionIcon[];

    public addIcon(icon: ProductionIcon): void {
        this.icons.push(icon);
    }

    public getIcon(iconName: string): ProductionIcon | undefined {
        return this.icons.find((icon: ProductionIcon) => {
            return icon.name === iconName;
        });
    }

    public init(searchResultItems: SearchResultItem[]): void {
        this.hasBeenInitialized = true;
    }
}
