import { SearchResultItem } from "../search-result-item";
import { SearchPlugin } from "./search-plugin";

export class MacOsSettingsPlugin implements SearchPlugin {
    public getAllItems(): SearchResultItem[] {
        return [];
    }
}
