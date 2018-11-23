import { ProductionIcon } from "./production-icon";
import { SearchResultItem } from "../search-result-item";
import { normalize, join } from "path";
import { convert } from "app2png";
import { readFile, existsSync, mkdirSync } from "fs";
import { IconStore } from "./icon-store";
import { IconSet } from "../icon-sets/icon-set";

export class MacOSIconStore implements IconStore {
    private readonly storePath: string;
    private readonly icons: ProductionIcon[] = [];
    private readonly iconSet: IconSet;

    constructor(storePath: string, iconSet: IconSet) {
        this.storePath = storePath;
        this.iconSet = iconSet;
    }

    public addIcon(icon: ProductionIcon): void {
        this.icons.push(icon);
    }

    public getIcon(iconName: string): ProductionIcon | undefined {
        return this.icons.find((icon: ProductionIcon) => icon.name === iconName);
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
                this.getFileIconFromPath(outFilePath).then((base64Icon: string) => {
                    this.addIcon({ name: appName, base64Icon });
                }).then(() => {
                    // do nothing
                });
            }).catch(() => {
                // do nothing
            });
        });
    }

    private getFileIconFromPath(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            readFile(filePath, (err: Error, buffer: Buffer) => {
                if (err || buffer === undefined || buffer === null || buffer.length === 0) {
                    reject(err);
                } else {
                    const base64Icon = buffer.toString("base64");
                    resolve(base64Icon);
                }
            });
        });
    }
}
