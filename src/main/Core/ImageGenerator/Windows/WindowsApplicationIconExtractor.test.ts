import { describe, expect, it } from "vitest";
import { WindowsApplicationIconExtractor } from "./WindowsApplicationIconExtractor";

describe(WindowsApplicationIconExtractor, () => {
    describe(WindowsApplicationIconExtractor.prototype.matchesFilePath, () => {
        const testMatchesFilePath = ({ filePath, expected }: { filePath: string; expected: boolean }) =>
            expect(new WindowsApplicationIconExtractor(null, null, null, "").matchesFilePath(filePath)).toBe(expected);

        it("should return true when file path ends with .lnk, .url, .appref-ms, .exe", () => {
            const filePaths = [
                "file.lnk",
                "file.url",
                "file.appref-ms",
                "file.exe",
                "file.LNK",
                "file.URL",
                "file.APPREF-MS",
                "file.EXE",
            ];

            for (const filePath of filePaths) {
                testMatchesFilePath({ filePath, expected: true });
            }
        });

        it("should return false when file path ends with other file extensions", () => {
            const filePaths = [
                "",
                " ",
                "file",
                "file.ln",
                "file.ex",
                "lnk",
                "exe",
                "file.txt",
                "file.doc",
                "file.docx",
                "file.pdf",
                "file.jpg",
                "file.png",
            ];

            for (const filePath of filePaths) {
                testMatchesFilePath({ filePath, expected: false });
            }
        });
    });
});
