import { describe, expect, it } from "vitest";
import { EverythingFileSearcher } from "./Windows/EverythingFileSearcher";

describe(EverythingFileSearcher, () => {
    describe(EverythingFileSearcher.escapeSearchTerm, () => {
        it.each([
            ["test", "test"],
            ["ext:pdf test", "ext:pdf test"],
            ["size:>1MB", "size:^>1MB"],
            ["size:<1MB", "size:^<1MB"],
            ["ext:txt -s", "ext:txt -s"],
            [
                "-size -dm -sizecolor 0x0d -dmcolor 0x0b -save-settings",
                "-size -dm -sizecolor 0x0d -dmcolor 0x0b -save-settings",
            ],
            ["\\&|><^", "^\\^&^|^>^<^^"],
        ])("should escape arguments with a regex", (searchTerm, expectedPattern) => {
            const escapedSearchTerm = searchTerm.replace(/([\\&|><^])/g, "^$1");
            expect(escapedSearchTerm).toMatch(expectedPattern);
        });
    });
});
