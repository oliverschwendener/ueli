import { AppIconStore } from "../../ts/icon-service/app-icon-store";
import { ApplicationIcon } from "../../ts/icon-service/application-icon";
import { SearchResultItem } from "../../ts/search-result-item";

export class FakeAppIconStore implements AppIconStore {
    public hasBeenInitialized = false;
    private readonly icons: ApplicationIcon[] = [];

    public addIcon(icon: ApplicationIcon): void {
        this.icons.push(icon);
    }

    public getIcon(iconName: string): ApplicationIcon | undefined {
        return this.icons.find((icon: ApplicationIcon) => {
            return icon.name === iconName;
        });
    }

    public init(searchResultItems: SearchResultItem[]): void {
        this.hasBeenInitialized = true;
    }
}
