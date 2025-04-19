import type { Net } from "electron";
import type { Suggestion } from "./Suggestion";
import type { WebSearchEngine } from "./WebSearchEngine";

type DuckDuckGoSuggestion = {
    phrase: string;
};

export class DuckDuckGoWebSearchEngine implements WebSearchEngine {
    public constructor(private readonly net: Net) {}

    public async getSuggestions(searchTerm: string, locale: string): Promise<Suggestion[]> {
        const response = await this.net.fetch(
            `https://duckduckgo.com/ac/?q=${encodeURIComponent(searchTerm)}&kl=${this.getLocaleString(locale)}`,
        );

        const suggestions = (await response.json()) as DuckDuckGoSuggestion[];

        return suggestions.map(
            ({ phrase }): Suggestion => ({
                text: phrase,
                url: this.getSearchUrl(phrase, locale),
            }),
        );
    }

    public getSearchUrl(searchTerm: string, locale: string): string {
        return `https://duckduckgo.com/?q=${encodeURIComponent(searchTerm)}&kl=${this.getLocaleString(locale)}`;
    }

    public getImageFileName(): string {
        return "duckduckgo.svg";
    }

    public getName(): string {
        return "DuckDuckGo";
    }

    private getLocaleString(locale: string): string {
        const map: Record<string, string> = {
            "en-US": "us-en",
            "de-CH": "ch-de",
            "ja-JP": "jp-jp",
            "ko-KR": "kr-kr",
        };

        return map[locale] ?? map["en-US"];
    }
}
