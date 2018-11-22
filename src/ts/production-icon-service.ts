import { NativeImage } from "electron";
import { SearchResultItem } from "./search-result-item";
import { IconSet } from "./icon-sets/icon-set";
import { app } from "electron";
import { writeFileSync } from "fs";

export class ProductionIconService {
    public getProgramIcon(iconSet: IconSet, searchResultItem: SearchResultItem ): Promise<SearchResultItem> {
        return new Promise((resolve, reject) => {
            if (searchResultItem.icon === iconSet.appIcon || searchResultItem.icon === iconSet.fileIcon) {
                app.getFileIcon(searchResultItem.executionArgument, { size: "normal" }, (error: Error, icon: NativeImage) => {
                    if (error) {
                        resolve(searchResultItem);
                    } else {
                        writeFileSync(`/Users/oliverschwendener/Downloads/test/${searchResultItem.name}.png`, icon.toPNG());
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
