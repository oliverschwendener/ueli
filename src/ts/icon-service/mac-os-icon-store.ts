import { ApplicationIcon } from "./base64-icon";
import { SearchResultItem } from "../search-result-item";
import { normalize, join } from "path";
import { convert } from "app2png";
import { existsSync, mkdirSync } from "fs";
import { IconStore } from "./icon-store";
import { IconSet } from "../icon-sets/icon-set";

export class MacOSIconStore implements IconStore {
    private readonly storePath: string;
    private readonly icons: ApplicationIcon[] = [];
    private readonly iconSet: IconSet;

    constructor(storePath: string, iconSet: IconSet) {
        this.storePath = storePath;
        this.iconSet = iconSet;
    }

    public addIcon(icon: ApplicationIcon): void {
        this.icons.push(icon);
    }

    public getIcon(iconName: string): ApplicationIcon | undefined {
        return this.icons.find((icon: ApplicationIcon) => icon.name === iconName);
    }

    public init(searchResultItems: SearchResultItem[]): void {
        if (!existsSync(this.storePath)) {
            mkdirSync(this.storePath);
        }

        searchResultItems.filter((searchResultItem: SearchResultItem) => {
            return searchResultItem.icon === this.iconSet.appIcon;
        }).forEach((searchResultItem: SearchResultItem) => {
            const appFilePath = normalize(searchResultItem.executionArgument);
            const appName = searchResultItem.name;
            const outFilePath = join(this.storePath, `${appName}.png`);

            convert(appFilePath, outFilePath).then(() => {
                this.addIcon({ name: appName, PNGFilePath: outFilePath });
            }).catch(() => {
                // do nothing
            });
        });
    }
}
