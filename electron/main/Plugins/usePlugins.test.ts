import { describe, expect, it } from "vitest";
import { SearchIndex } from "../SearchIndex";
import { MacOsApplicationSearch } from "./MacOsApplicationSearch";
import { usePlugins } from "./usePlugins";

const searchIndex = {} as SearchIndex;

describe(usePlugins, () => {
    it("should return all macOS plugins when the operating system is macOS", () => {
        const { plugins } = usePlugins("macOS", searchIndex);
        expect(plugins).toEqual([new MacOsApplicationSearch(searchIndex)]);
    });

    it("should return all macOS plugins when the operating system is macOS", () => {
        const { plugins } = usePlugins("Windows", searchIndex);
        expect(plugins).toEqual([]);
    });
});
