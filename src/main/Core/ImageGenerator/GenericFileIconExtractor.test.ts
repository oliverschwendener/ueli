import type { App, NativeImage } from "electron";
import { describe, expect, it, vi } from "vitest";
import { GenericFileIconExtractor } from "./GenericFileIconExtractor";

describe(GenericFileIconExtractor, () => {
    describe("matchesFilePath", () => {
        it("should always return true", () =>
            expect(new GenericFileIconExtractor(<App>{}).matchesFilePath()).toBe(true));
    });

    describe("extractFileIcon", () => {
        it("should extract the file icon", async () => {
            const nativeImage = <NativeImage>{ toDataURL: () => "test url" };
            const getFileIconMock = vi.fn().mockResolvedValue(nativeImage);
            const app = <App>{ getFileIcon: (filePath) => getFileIconMock(filePath) };

            const actual = await new GenericFileIconExtractor(app).extractFileIcon("my file path");

            expect(actual).toEqual({ url: "test url" });
            expect(getFileIconMock).toHaveBeenCalledWith("my file path");
        });
    });

    describe("extractFileIcons", () => {
        it("should extract the file icons", async () => {
            const getFileIconMock = vi.fn().mockImplementation((filePath: string) => {
                const map: Record<string, NativeImage> = {
                    "file 1": <NativeImage>{ toDataURL: () => "test url 1" },
                    "file 2": <NativeImage>{ toDataURL: () => "test url 2" },
                };

                return map[filePath] ? Promise.resolve(map[filePath]) : Promise.reject("Unable to extract file icon");
            });

            const app = <App>{ getFileIcon: (filePath) => getFileIconMock(filePath) };

            const actual = await new GenericFileIconExtractor(app).extractFileIcons(["file 1", "file 2", "file 3"]);

            expect(actual).toEqual({
                "file 1": { url: "test url 1" },
                "file 2": { url: "test url 2" },
            });

            expect(getFileIconMock).toHaveBeenCalledWith("file 1");
            expect(getFileIconMock).toHaveBeenCalledWith("file 2");
            expect(getFileIconMock).toHaveBeenCalledWith("file 3");
        });
    });
});
