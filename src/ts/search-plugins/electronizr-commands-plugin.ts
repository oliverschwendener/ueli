import * as path from "path";
import { Config } from "../config";
import { SearchResultItem } from "../search-result-item";
import { SearchPlugin } from "./search-plugin";

export class ElectronizrCommandsSearchPlugin implements SearchPlugin {
    private items: ElectronizrCommand[];
    private icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                        <g id="surface1">
                            <path style=" " d="M 0 1 L 0 10.5 L 19 12 L 0 13.5 L 0 23 L 24 12 Z "></path>
                        </g>
                    </svg>`;

    public constructor() {
        this.items = [
            {
                executionArgument: `${Config.electronizrCommandPrefix}reload`,
                name: "Reload electronizr",
            } as ElectronizrCommand,
            {
                executionArgument: `${Config.electronizrCommandPrefix}exit`,
                name: "Exit electronizr",
            } as ElectronizrCommand,
            {
                executionArgument: Config.configFilePath,
                name: "Edit configuration file",
            } as ElectronizrCommand,
        ];
    }

    public getAllItems(): SearchResultItem[] {
        return this.items.map((i): SearchResultItem => {
            return {
                executionArgument: i.executionArgument,
                icon: this.icon,
                name: i.name,
                tags: [],
            } as SearchResultItem;
        });
    }
}
