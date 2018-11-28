import { app, NativeImage } from "electron";
import { normalize } from "path";
import { SearchResultItem } from "../search-result-item";
import { IconSet } from "../icon-sets/icon-set";

export class FileIconService {
    private readonly iconSet: IconSet;

    constructor(iconSet: IconSet) {
        this.iconSet = iconSet;
    }

    public getFileIcon(searchResultItem: SearchResultItem): Promise<SearchResultItem> {
        return new Promise((resolve, reject) => {
            if (searchResultItem.icon === this.iconSet.fileIcon) {
                app.getFileIcon(normalize(searchResultItem.executionArgument), (err: Error, icon: NativeImage) => {
                    if (err) {
                        resolve(searchResultItem);
                    } else {
                        searchResultItem.icon = `<img src="${icon.toDataURL()}">`;
                        resolve(searchResultItem);
                    }
                });
            } else {
                resolve(searchResultItem);
            }
        });
    }
}
