import { AppIconStore } from "./app-icon-store";
import { ApplicationIcon } from "./application-icon";
import { SearchResultItem } from "../search-result-item";
import { IconSet } from "../icon-sets/icon-set";
import { normalize, join } from "path";
import { AppIconStoreHelpers } from "../helpers/app-icon-store-helpers";
import { existsSync, mkdirSync, unlinkSync } from "fs";
import { FileHelpers } from "../helpers/file-helpers";
import { generateIcons, Icon } from "windows-system-icon";

export class WindowsAppIconStore implements AppIconStore {
    private icons: ApplicationIcon[] = [];
    private readonly storePath: string;
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
        this.icons = [];

        if (!existsSync(this.storePath)) {
            mkdirSync(this.storePath);
        }

        const appIcons = searchResultItems
            .filter((searchResultItem: SearchResultItem) => {
                return searchResultItem.icon === this.iconSet.appIcon;
            })
            .map((app): Icon => {
                const appName = app.name;
                const inputFilePath = normalize(app.executionArgument);
                const outputFilePath = join(this.storePath, `${AppIconStoreHelpers.buildIconFileName(appName)}.png`);

                this.addIcon({ name: app.name, PNGFilePath: outputFilePath });

                return {
                    inputFilePath,
                    outputFilePath,
                    outputFormat: "Png",
                };
            });

        generateIcons(appIcons)
            .then(() => {
                // tslint:disable-next-line:no-console
                console.log("Sucessfully generated all app icons");
                this.removeNonExistentIcons();
            }).catch((err: string) => {
                // tslint:disable-next-line:no-console
                console.log(`Error while generating app icon: ${err}`);
                this.removeNonExistentIcons();
            });
    }

    public clearCache(): void {
        const files = FileHelpers.getFilesFromFolder(this.storePath);
        files.forEach((file) => {
            if (existsSync(file)) {
                unlinkSync(file);
            }
        });
    }

    private removeNonExistentIcons(): void {
        const indexesToDelete = [];

        for (let i = 0; i < this.icons.length; i++) {
            if (!existsSync(this.icons[i].PNGFilePath)) {
                indexesToDelete.push(i);
            }
        }

        indexesToDelete.forEach((i) => this.icons.splice(i, 1));
    }
}
