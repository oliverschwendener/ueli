import type { Image } from "@common/Core/Image";
import { describe, expect, it, vi } from "vitest";
import type { FileIconExtractor } from "./FileIconExtractor";
import { FileImageGenerator } from "./FileImageGenerator";

describe(FileImageGenerator, () => {
    describe(FileImageGenerator.prototype.getImage, () => {
        it("should return the extracted image from the first matching file icon extractor", async () => {
            const fileImageGenerator = new FileImageGenerator([
                {
                    matchesFilePath: () => false,
                    extractFileIcon: async () => <Image>{ url: "test url 1" },
                    extractFileIcons: async () => <Record<string, Image>>{},
                },
                {
                    matchesFilePath: () => false,
                    extractFileIcon: async () => <Image>{ url: "test url 2" },
                    extractFileIcons: async () => <Record<string, Image>>{},
                },
                {
                    matchesFilePath: () => true,
                    extractFileIcon: async () => <Image>{ url: "test url 3" },
                    extractFileIcons: async () => <Record<string, Image>>{},
                },
            ]);

            expect(await fileImageGenerator.getImage("my file path")).toEqual(<Image>{ url: "test url 3" });
        });

        it("should throw an error if all file icon extractors don't match the given file path", async () => {
            const fileImageGenerator = new FileImageGenerator([
                {
                    matchesFilePath: () => false,
                    extractFileIcon: async () => <Image>{ url: "test url 1" },
                    extractFileIcons: async () => <Record<string, Image>>{},
                },
                {
                    matchesFilePath: () => false,
                    extractFileIcon: async () => <Image>{ url: "test url 2" },
                    extractFileIcons: async () => <Record<string, Image>>{},
                },
                {
                    matchesFilePath: () => false,
                    extractFileIcon: async () => <Image>{ url: "test url 3" },
                    extractFileIcons: async () => <Record<string, Image>>{},
                },
            ]);

            await expect(fileImageGenerator.getImage("my file path")).rejects.toThrowError(
                `Failed to extract file icon from path "my file path". Reason: file path did not match any file icon extractor`,
            );
        });
    });

    describe(FileImageGenerator.prototype.getImages, () => {
        it("should bulk extract file icons", async () => {
            const extractFileIcons1 = vi.fn().mockResolvedValue({ path1: { url: "test url 1" } });
            const extractFileIcons2 = vi.fn().mockResolvedValue({ path2: { url: "test url 2" } });
            const extractFileIcons3 = vi.fn().mockResolvedValue({ path3: { url: "test url 3" } });

            const fileIconExtractor1 = <FileIconExtractor>{
                matchesFilePath: (f) => f.endsWith("1"),
                extractFileIcon: async () => <Image>{},
                extractFileIcons: (f) => extractFileIcons1(f),
            };

            const fileIconExtractor2 = <FileIconExtractor>{
                matchesFilePath: (f) => f.endsWith("2"),
                extractFileIcon: async () => <Image>{},
                extractFileIcons: (f) => extractFileIcons2(f),
            };

            const fileIconExtractor3 = <FileIconExtractor>{
                matchesFilePath: (f) => f.endsWith("3"),
                extractFileIcon: async () => <Image>{},
                extractFileIcons: (f) => extractFileIcons3(f),
            };

            const fileImageGenerator = new FileImageGenerator([
                fileIconExtractor1,
                fileIconExtractor2,
                fileIconExtractor3,
            ]);

            expect(await fileImageGenerator.getImages(["path1", "path2", "path3"])).toEqual({
                path1: { url: "test url 1" },
                path2: { url: "test url 2" },
                path3: { url: "test url 3" },
            });

            expect(extractFileIcons1).toHaveBeenCalledWith(["path1"]);
            expect(extractFileIcons2).toHaveBeenCalledWith(["path2"]);
            expect(extractFileIcons3).toHaveBeenCalledWith(["path3"]);
        });

        it("should prioritize the first matching file icon extractor", async () => {
            const extractFileIcons1 = vi.fn().mockResolvedValue({ path1: { url: "url1" } });
            const extractFileIcons2 = vi.fn().mockResolvedValue({ path2: { url: "url2" } });

            const fileIconExtractor1 = <FileIconExtractor>{
                matchesFilePath: (f) => f.endsWith("1"),
                extractFileIcon: async () => <Image>{},
                extractFileIcons: (f) => extractFileIcons1(f),
            };

            const fileIconExtractor2 = <FileIconExtractor>{
                matchesFilePath: () => true,
                extractFileIcon: async () => <Image>{},
                extractFileIcons: (f) => extractFileIcons2(f),
            };

            expect(
                await new FileImageGenerator([fileIconExtractor1, fileIconExtractor2]).getImages(["path1", "path2"]),
            ).toEqual({
                path1: <Image>{ url: "url1" },
                path2: <Image>{ url: "url2" },
            });

            expect(extractFileIcons1).toHaveBeenCalledWith(["path1"]);
            expect(extractFileIcons2).toHaveBeenCalledWith(["path2"]);
        });
    });
});
