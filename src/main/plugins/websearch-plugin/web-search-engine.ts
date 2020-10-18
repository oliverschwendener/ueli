import { Icon } from "../../../common/icon/icon";

export interface WebSearchEngine {
    prefix: string;
    url: string;
    name: string;
    icon: Icon;
    priority: number;
    isFallback: boolean;
    encodeSearchTerm: boolean;
    suggestionUrl?: string;
}
