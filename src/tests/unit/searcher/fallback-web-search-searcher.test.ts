import { FallbackWebSearchSercher } from "../../../ts/searcher/fallback-web-search-searcher";

describe(FallbackWebSearchSercher.name, (): void => {
    const searcher = new FallbackWebSearchSercher([], []);

    it("should not block other searchers", (): void => {
        const actual = searcher.blockOthers;
        expect(actual).toBe(false);
    });
});
