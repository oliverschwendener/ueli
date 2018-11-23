import { SearchResultItem } from "../search-result-item";
import { IconSet } from "../icon-sets/icon-set";
import { normalize } from "path";
import { convert } from "app2png";
import { readFile } from "fs";
import { ProductionIconStore } from "./production-icon-store";

export class ProductionIconService {
    private readonly iconStore: ProductionIconStore;

    constructor(iconStore: ProductionIconStore) {
        this.iconStore = iconStore;
    }

    public getProgramIcon(iconSet: IconSet, searchResultItem: SearchResultItem ): Promise<SearchResultItem> {
        return new Promise((resolve, reject) => {
            if (searchResultItem.icon === iconSet.appIcon) {
                const outFilePath = normalize(`/Users/oliverschwendener/Downloads/test/${searchResultItem.name}.png`);
                const inFilePath = normalize(searchResultItem.executionArgument);
                const outFileExists = this.iconStore.getIcon(searchResultItem.name) !== undefined;

                if (!outFileExists) {
                    convert(inFilePath, outFilePath).then(() => {
                        this.getFileIconFromPath(outFilePath).then((icon: string) => {
                            this.iconStore.addIcon({ base64Icon: icon, name: searchResultItem.name });
                            searchResultItem.icon = icon;
                            resolve(searchResultItem);
                        }).catch(() => {
                            resolve(searchResultItem);
                        });
                    }).catch(() => {
                        resolve(searchResultItem);
                    });
                } else {
                    const icon = this.iconStore.getIcon(searchResultItem.name);
                    if (icon === undefined) {
                        resolve(searchResultItem);
                    } else {
                        searchResultItem.icon = icon.base64Icon;
                        resolve(searchResultItem);
                    }
                }
            } else {
                resolve(searchResultItem);
            }
        });
    }

    private getFileIconFromPath(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            readFile(filePath, (err: Error, buffer: Buffer) => {
                if (err || buffer === undefined || buffer === null || buffer.length === 0) {
                    reject(err);
                } else {
                    const base64Icon = buffer.toString("base64");
                    const result = `<img src="data:image/png;base64,${base64Icon}">`;
                    resolve(result);
                }
            });
        });
    }
}
