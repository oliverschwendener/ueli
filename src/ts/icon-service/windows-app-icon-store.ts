import { AppIconStore } from "./app-icon-store";
import { ApplicationIcon } from "./application-icon";
import { SearchResultItem } from "../search-result-item";
import { IconSet } from "../icon-sets/icon-set";
import shell = require("node-powershell");
import { normalize, join } from "path";
import { AppIconStoreHelpers } from "../helpers/app-icon-store-helpers";

export class WindowsAppIconStore implements AppIconStore {
    private readonly icons: ApplicationIcon[] = [];
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
        const ps = new shell({
            debugMsg: false,
            executionPolicy: "Bypass",
            noProfile: true,
        });

        ps.addCommand(`Add-Type -AssemblyName System.Drawing`);

        const apps = searchResultItems.filter((searchResultItem: SearchResultItem) => {
            return searchResultItem.icon === this.iconSet.appIcon;
        });

        for (const app of apps) {
            const inFilePath = normalize(app.executionArgument);
            const appName = app.name;
            const outFilePath = join(this.storePath, `${AppIconStoreHelpers.buildIconFileName(appName)}.png`);

            ps.addCommand(`$icon = [System.Drawing.Icon]::ExtractAssociatedIcon("${inFilePath}")`);
            ps.addCommand(`$bitmap = $icon.ToBitmap().save("${outFilePath}", [System.Drawing.Imaging.ImageFormat]::Png);`);

            this.addIcon({ name: app.name, PNGFilePath: outFilePath });
        }

        ps.invoke().then(() => {
            // tslint:disable-next-line:no-console
            console.log("Sucessfully generated all app icons");
        }).catch((err) => {
            // tslint:disable-next-line:no-console
            console.log(`Error while generating app icon: ${err}`);
        });
    }
}
