import type { ExtensionCacheFolder } from "@Core/ExtensionCacheFolder";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { Image } from "@common/Core/Image";
import type { NativeImage } from "electron";
import { describe, expect, it, vi } from "vitest";
import { FileImageGenerator } from "./FileImageGenerator";

describe(FileImageGenerator, () => {
    it("should return the data image url from the file icon", async () => {
        const getFileIconMock = vi.fn().mockResolvedValue(<NativeImage>{ toDataURL: () => "dataUrlDummy" });
        const extensionCacheFolder = <ExtensionCacheFolder>{};
        const fileSystemUtility = <FileSystemUtility>{};

        const fileImageGenerator = new FileImageGenerator(extensionCacheFolder, fileSystemUtility);

        expect(await fileImageGenerator.getImage("my file")).toEqual(<Image>{ url: "dataUrlDummy" });
        expect(getFileIconMock).toHaveBeenCalledWith("my file");
    });
});
