import type { Net } from "electron";
import { describe, expect, it, vi } from "vitest";
import { GoogleWebSearchEngine } from "./GoogleWebSearchEngine";

describe(GoogleWebSearchEngine, () => {
    describe(GoogleWebSearchEngine.prototype.getSuggestions, () => {
        it("should return suggestions", async () => {
            const fetchMock = vi.fn().mockResolvedValue({
                json: () => ["test", ["test1", "test2"]],
            });

            const net = <Net>{ fetch: (url) => fetchMock(url) };

            expect(await new GoogleWebSearchEngine(net).getSuggestions("test", "en-US")).toEqual([
                { text: "test1", url: "https://google.com/search?q=test1&hl=en-us" },
                { text: "test2", url: "https://google.com/search?q=test2&hl=en-us" },
            ]);
        });

        it("should return an empty list when there are no suggestions", async () => {
            const fetchMock = vi.fn().mockResolvedValue({
                json: () => ["test"],
            });

            const net = <Net>{ fetch: (url) => fetchMock(url) };

            expect(await new GoogleWebSearchEngine(net).getSuggestions("test", "en-US")).toEqual([]);
        });
    });

    describe(GoogleWebSearchEngine.prototype.getSearchUrl, () => {
        it("should return the search URL", () => {
            expect(new GoogleWebSearchEngine(<Net>{}).getSearchUrl("test", "en-US")).toBe(
                "https://google.com/search?q=test&hl=en-us",
            );
        });
    });

    describe(GoogleWebSearchEngine.prototype.getImageFileName, () => {
        it("should return the image file name", () => {
            expect(new GoogleWebSearchEngine(<Net>{}).getImageFileName()).toBe("google.png");
        });
    });

    describe(GoogleWebSearchEngine.prototype.getName, () => {
        it("should return the name", () => {
            expect(new GoogleWebSearchEngine(<Net>{}).getName()).toBe("Google");
        });
    });
});
