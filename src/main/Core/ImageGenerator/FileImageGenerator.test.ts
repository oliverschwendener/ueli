import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { Image } from "@common/Core/Image";
import { createHash } from "crypto";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import { FileImageGenerator } from "./FileImageGenerator";

describe(FileImageGenerator, () => {
    const cacheFolderPath = "cacheFolderPath";

    it("should clear cache folder if it exists", async () => {
        const pathExistsMock = vi.fn().mockReturnValue(true);
        const clearFolderMock = vi.fn().mockReturnValue(Promise.resolve());

        const fileSystemUtility = <FileSystemUtility>{
            pathExists: (f) => pathExistsMock(f),
            clearFolder: (f) => clearFolderMock(f),
        };

        const fileImageGenerator = new FileImageGenerator(cacheFolderPath, fileSystemUtility, () => null);

        await fileImageGenerator.clearCache();
        expect(pathExistsMock).toHaveBeenCalledWith(cacheFolderPath);
        expect(clearFolderMock).toHaveBeenCalledWith(cacheFolderPath);
    });

    it("should do nothing if cache folder does not exist", async () => {
        const pathExistsMock = vi.fn().mockReturnValue(false);
        const fileSystemUtility = <FileSystemUtility>{ pathExists: (f) => pathExistsMock(f) };

        const fileImageGenerator = new FileImageGenerator(cacheFolderPath, fileSystemUtility, () => null);

        await fileImageGenerator.clearCache();
        expect(pathExistsMock).toHaveBeenCalledWith(cacheFolderPath);
    });

    it("should create the cached file if it doesn't exist and return the image", async () => {
        const pathExistsMock = vi.fn().mockReturnValue(false);
        const writePngMock = vi.fn().mockReturnValue(Promise.resolve());
        const buffer = Buffer.from("testBuffer");

        const fileSystemUtility = <FileSystemUtility>{
            pathExists: (f) => pathExistsMock(f),
            writePng: (b, f) => writePngMock(b, f),
        };

        const cachedPngFilePath = join(cacheFolderPath, `${createHash("sha1").update("my file").digest("hex")}.png`);

        const actual = await new FileImageGenerator(cacheFolderPath, fileSystemUtility, () => buffer).getImage(
            "my file",
        );

        expect(actual).toEqual(<Image>{ url: `file://${cachedPngFilePath}` });
        expect(pathExistsMock).toHaveBeenCalledWith(cachedPngFilePath);
        expect(writePngMock).toHaveBeenCalledWith(buffer, cachedPngFilePath);
    });

    it("should not write a new cached file if it already exists and return the image", async () => {
        const pathExistsMock = vi.fn().mockReturnValue(true);
        const writePngMock = vi.fn().mockReturnValue(Promise.resolve());

        const fileSystemUtility = <FileSystemUtility>{
            pathExists: (f) => pathExistsMock(f),
            writePng: (b, f) => writePngMock(b, f),
        };

        const cachedPngFilePath = join(cacheFolderPath, `${createHash("sha1").update("my file").digest("hex")}.png`);

        const actual = await new FileImageGenerator(cacheFolderPath, fileSystemUtility, () => null).getImage("my file");

        expect(actual).toEqual(<Image>{ url: `file://${cachedPngFilePath}` });
        expect(pathExistsMock).toHaveBeenCalledWith(cachedPngFilePath);
        expect(writePngMock).not.toHaveBeenCalled();
    });

    it("should throw an error if getFileIcon returns buffer with empty buffer length", async () => {
        const pathExistsMock = vi.fn().mockReturnValue(false);
        const fileSystemUtility = <FileSystemUtility>{ pathExists: (f) => pathExistsMock(f) };

        const cachedPngFilePath = join(cacheFolderPath, `${createHash("sha1").update("my file").digest("hex")}.png`);

        const fileImageGenerator = new FileImageGenerator(cacheFolderPath, fileSystemUtility, () => Buffer.alloc(0));

        expect(() => fileImageGenerator.getImage("my file")).rejects.toThrow(
            "getFileIcon returned Buffer with length 0",
        );
        expect(pathExistsMock).toHaveBeenCalledWith(cachedPngFilePath);
    });
});
