import type { ExtensionCacheFolder } from "@Core/ExtensionCacheFolder";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { Image } from "@common/Core/Image";
import { createHash } from "crypto";
import { describe, expect, it, vi } from "vitest";
import { FileImageGenerator } from "./FileImageGenerator";

describe(FileImageGenerator, () => {
    it("should create the cached file if it doesn't exist and return the image", async () => {
        const pathExistsMock = vi.fn().mockReturnValue(false);
        const writePngMock = vi.fn().mockReturnValue(Promise.resolve());

        const extensionCacheFolder = <ExtensionCacheFolder>{ path: "extensionCacheFolder" };
        const fileSystemUtility = <FileSystemUtility>{
            pathExists: (f) => pathExistsMock(f),
            writePng: (b, f) => writePngMock(b, f),
        };

        vi.mock("extract-file-icon", () => {
            return {
                default: () => Buffer.from("testBuffer"),
            };
        });

        const cachedPngFilePath = `extensionCacheFolder/${createHash("sha1").update("my file").digest("hex")}.png`;

        const actual = await new FileImageGenerator(extensionCacheFolder, fileSystemUtility).getImage("my file");

        expect(actual).toEqual(<Image>{ url: `file://${cachedPngFilePath}` });
        expect(pathExistsMock).toHaveBeenCalledWith(cachedPngFilePath);
        expect(writePngMock).toHaveBeenCalledWith(Buffer.from("testBuffer"), cachedPngFilePath);
    });

    it("should not write a new cached file if it already exists and return the image", async () => {
        const pathExistsMock = vi.fn().mockReturnValue(true);
        const writePngMock = vi.fn().mockReturnValue(Promise.resolve());

        const extensionCacheFolder = <ExtensionCacheFolder>{ path: "extensionCacheFolder" };
        const fileSystemUtility = <FileSystemUtility>{
            pathExists: (f) => pathExistsMock(f),
            writePng: (b, f) => writePngMock(b, f),
        };

        const cachedPngFilePath = `extensionCacheFolder/${createHash("sha1").update("my file").digest("hex")}.png`;

        const actual = await new FileImageGenerator(extensionCacheFolder, fileSystemUtility).getImage("my file");

        expect(actual).toEqual(<Image>{ url: `file://${cachedPngFilePath}` });
        expect(pathExistsMock).toHaveBeenCalledWith(cachedPngFilePath);
        expect(writePngMock).not.toHaveBeenCalled();
    });
});
