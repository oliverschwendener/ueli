import { WebSearchEngine } from "../../main/plugins/websearch-plugin/web-search-engine";

export interface WebSearchOptions {
    isEnabled: boolean;
    webSearchEngines: WebSearchEngine[],
}
