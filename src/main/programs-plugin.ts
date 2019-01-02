import { Plugin } from "./plugin";
import { SearchResultItem } from "../common/search-result-item";

export class ProgramsPlugin implements Plugin {
    private readonly items: SearchResultItem[];

    constructor() {
        this.items = [
            { name: "Adobe Photoshop" },
            { name: "Adobe After Effects" },
            { name: "Adobe Premiere Pro" },
            { name: "Adobe Illustrator" },
        ];
    }

    public getAll(): SearchResultItem[] {
        return this.items;
    }
}
