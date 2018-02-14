import { SearchPlugin } from "./search-plugin";
import { SearchResultItem } from "../search-engine";
import { Config } from "../config";

export class ElectronizrCommandsSearchPlugin implements SearchPlugin {
    private items: ElectronizrCommand[];
    private icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                        <g id="surface1">
                            <path style=" " d="M 0 1 L 0 10.5 L 19 12 L 0 13.5 L 0 23 L 24 12 Z "></path>
                        </g>
                    </svg>`;

    public constructor() {
        this.items = [
            <ElectronizrCommand>{
                name: "Reload electronizr",
                command: "reload"
            },
            <ElectronizrCommand>{
                name: "Exit electronizr",
                command: "exit"
            }
        ];
    }

    public getAllItems(): SearchResultItem[] {
        return this.items.map((i): SearchResultItem => {
            return <SearchResultItem>{
                name: i.name,
                executionArgument: `${Config.electronizrCommandPrefix}${i.command}`,
                icon: this.icon,
                tags: []
            };
        });
    }
}

class ElectronizrCommand {
    public name: string;
    public command: string;
}