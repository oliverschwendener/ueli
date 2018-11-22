import { NativeImage } from "electron";
import { SearchResultItem } from "./search-result-item";
import { IconSet } from "./icon-sets/icon-set";
import { app } from "electron";
import { normalize } from "path";

export class ProductionIconService {
    public getProgramIcon(iconSet: IconSet, searchResultItem: SearchResultItem ): Promise<SearchResultItem> {
        return new Promise((resolve, reject) => {
            if (searchResultItem.icon === iconSet.appIcon || searchResultItem.icon === iconSet.fileIcon) {
                app.getFileIcon(normalize(searchResultItem.executionArgument), { size: "normal" }, (error: Error, icon: NativeImage) => {
                    if (error) {
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
