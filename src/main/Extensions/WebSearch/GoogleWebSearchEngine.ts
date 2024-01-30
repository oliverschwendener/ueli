import type { Net } from "electron";
import type { Suggestion } from "./Suggestion";
import type { WebSearchEngine } from "./WebSearchEngine";

export class GoogleWebSearchEngine implements WebSearchEngine {
    public constructor(private readonly net: Net) {}

    public async getSuggestions(searchTerm: string, locale: string): Promise<Suggestion[]> {
        const response = await this.net.fetch(
            `https://www.google.com/complete/search?client=opera&q=${encodeURIComponent(
                searchTerm,
            )}&hl=${locale.toLowerCase()}`,
        );

        const results = (await response.json()) as [string, string[]];

        const suggestions = results[1] ? results[1] : [];

        return suggestions.map((s) => ({ text: s, url: this.getSearchUrl(s, locale) }));
    }

    public getSearchUrl(searchTerm: string, locale: string): string {
        return `https://google.com/search?q=${encodeURIComponent(searchTerm)}&hl=${locale.toLowerCase()}`;
    }

    public getImageFileName(): string {
        return "google.png";
    }

    public getName(): string {
        return "Google";
    }
}
