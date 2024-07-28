import type { Net } from "electron";
import { describe, expect, it, vi } from "vitest";
import { DuckDuckGoWebSearchEngine } from "./DuckDuckGoWebSearchEngine";

describe(DuckDuckGoWebSearchEngine, () => {
    describe(DuckDuckGoWebSearchEngine.prototype.getSuggestions, () => {
        it("should return suggestions", async () => {
            const fetchMock = vi.fn().mockResolvedValue({
                json: () => [{ phrase: "test1" }, { phrase: "test2" }],
            });

            const net = <Net>{ fetch: (url) => fetchMock(url) };

            expect(await new DuckDuckGoWebSearchEngine(net).getSuggestions("test", "en-US")).toEqual([
                { text: "test1", url: "https://duckduckgo.com/?q=test1&kl=us-en" },
                { text: "test2", url: "https://duckduckgo.com/?q=test2&kl=us-en" },
            ]);
        });
    });

    describe(DuckDuckGoWebSearchEngine.prototype.getSearchUrl, () => {
        it("should return the search URL", () => {
            expect(new DuckDuckGoWebSearchEngine(<Net>{}).getSearchUrl("test", "en-US")).toBe(
                "https://duckduckgo.com/?q=test&kl=us-en",
            );
        });

        it("should return the search URL with default language when the given locale is not supported", () => {
            expect(new DuckDuckGoWebSearchEngine(<Net>{}).getSearchUrl("test", "de-DE")).toBe(
                "https://duckduckgo.com/?q=test&kl=us-en",
            );
        });
    });

    describe(DuckDuckGoWebSearchEngine.prototype.getImageFileName, () => {
        it("should return the image file name", () => {
            expect(new DuckDuckGoWebSearchEngine(<Net>{}).getImageFileName()).toBe("duckduckgo.svg");
        });
    });

    describe(DuckDuckGoWebSearchEngine.prototype.getName, () => {
        it("should return the name", () => {
            expect(new DuckDuckGoWebSearchEngine(<Net>{}).getName()).toBe("DuckDuckGo");
        });
    });
});
