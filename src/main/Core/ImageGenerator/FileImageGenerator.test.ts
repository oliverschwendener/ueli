import type { Image } from "@common/Core/Image";
import { describe, expect, it } from "vitest";
import { FileImageGenerator } from "./FileImageGenerator";

describe(FileImageGenerator, () => {
    it("should return the extracted image from the first matching file icon extractor", async () => {
        const fileImageGenerator = new FileImageGenerator([
            {
                machtes: () => false,
                extractFileIcon: async () => <Image>{ url: "test url 1" },
                extractFileIcons: async () => <Record<string, Image>>{},
            },
            {
                machtes: () => false,
                extractFileIcon: async () => <Image>{ url: "test url 2" },
                extractFileIcons: async () => <Record<string, Image>>{},
            },
            {
                machtes: () => true,
                extractFileIcon: async () => <Image>{ url: "test url 3" },
                extractFileIcons: async () => <Record<string, Image>>{},
            },
        ]);

        expect(await fileImageGenerator.getImage("my file path")).toEqual(<Image>{ url: "test url 3" });
    });

    it("should throw an error if all file icon extractors don't match the given file path", async () => {
        const fileImageGenerator = new FileImageGenerator([
            {
                machtes: () => false,
                extractFileIcon: async () => <Image>{ url: "test url 1" },
                extractFileIcons: async () => <Record<string, Image>>{},
            },
            {
                machtes: () => false,
                extractFileIcon: async () => <Image>{ url: "test url 2" },
                extractFileIcons: async () => <Record<string, Image>>{},
            },
            {
                machtes: () => false,
                extractFileIcon: async () => <Image>{ url: "test url 3" },
                extractFileIcons: async () => <Record<string, Image>>{},
            },
        ]);

        await expect(fileImageGenerator.getImage("my file path")).rejects.toThrowError(
            `Failed to extract file icon from path "my file path". Reason: file path did not match any file icon extractor`,
        );
    });

    it("should bulk extract file icons", async () => {
        const fileImageGenerator = new FileImageGenerator([
            {
                machtes: () => false,
                extractFileIcon: async () => <Image>{},
                extractFileIcons: async () => <Record<string, Image>>{},
            },
            {
                machtes: () => false,
                extractFileIcon: async () => <Image>{},
                extractFileIcons: async () => <Record<string, Image>>{},
            },
            {
                machtes: () => true,
                extractFileIcon: async () => <Image>{},
                extractFileIcons: async () =>
                    <Record<string, Image>>{
                        path1: <Image>{ url: "test url 1" },
                        path2: <Image>{ url: "test url 2" },
                        path3: <Image>{ url: "test url 3" },
                    },
            },
        ]);

        expect(await fileImageGenerator.getImages(["path1", "path2", "path3"])).toEqual({
            path1: <Image>{ url: "test url 1" },
            path2: <Image>{ url: "test url 2" },
            path3: <Image>{ url: "test url 3" },
        });
    });

    it("should throw an error when no file image extractor matches all given file paths", async () => {
        const fileImageGenerator = new FileImageGenerator([
            {
                machtes: () => false,
                extractFileIcon: async () => <Image>{},
                extractFileIcons: async () => <Record<string, Image>>{},
            },
            {
                machtes: () => false,
                extractFileIcon: async () => <Image>{},
                extractFileIcons: async () => <Record<string, Image>>{},
            },
            {
                machtes: () => false,
                extractFileIcon: async () => <Image>{},
                extractFileIcons: async () => <Record<string, Image>>{},
            },
        ]);

        await expect(fileImageGenerator.getImages(["path1", "path2", "path3"])).rejects.toThrowError(
            "Failed to extract file icons. Reason: file paths did not match any file icon extractor",
        );
    });
});
