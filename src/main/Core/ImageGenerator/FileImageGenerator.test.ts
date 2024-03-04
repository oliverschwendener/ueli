import type { Image } from "@common/Core/Image";
import { describe, expect, it } from "vitest";
import { FileImageGenerator } from "./FileImageGenerator";

describe(FileImageGenerator, () => {
    it("should return the extracted image from the first matching file icon extractor", async () => {
        const fileImageGenerator = new FileImageGenerator([
            {
                validate: () => false,
                extractFileIcon: async () => <Image>{ url: "test url 1" },
            },
            {
                validate: () => false,
                extractFileIcon: async () => <Image>{ url: "test url 2" },
            },
            {
                validate: () => true,
                extractFileIcon: async () => <Image>{ url: "test url 3" },
            },
        ]);

        expect(await fileImageGenerator.getImage("my file path")).toEqual(<Image>{ url: "test url 3" });
    });

    it("should throw an error if all file icon extractors don't match the given file path", async () => {
        const fileImageGenerator = new FileImageGenerator([
            {
                validate: () => false,
                extractFileIcon: async () => <Image>{ url: "test url 1" },
            },
            {
                validate: () => false,
                extractFileIcon: async () => <Image>{ url: "test url 2" },
            },
            {
                validate: () => false,
                extractFileIcon: async () => <Image>{ url: "test url 3" },
            },
        ]);

        await expect(fileImageGenerator.getImage("my file path")).rejects.toThrowError(
            `Failed to extract file icon from path "my file path". Reason: file path did not match any file icon extractors`,
        );
    });
});
