import type { Suggestion } from "./Suggestion";

export interface WebSearchEngine {
    getSuggestions(searchTerm: string, locale: string): Promise<Suggestion[]>;
    getSearchUrl(searchTerm: string, locale: string): string;
    getImageFileName(): string;
    getName(): string;
}
