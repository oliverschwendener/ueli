import { SearchPlugin } from "./search-plugin";
import { SearchResultItem } from "../search-engine";

export class MacOsSettingsPlugin implements SearchPlugin {
    public getAllItems(): SearchResultItem[] {
        return [];
    }
}