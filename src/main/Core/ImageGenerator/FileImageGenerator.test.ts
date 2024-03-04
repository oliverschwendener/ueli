import type { Image } from "@common/Core/Image";
import type { App, NativeImage } from "electron";
import { describe, expect, it, vi } from "vitest";
import { FileImageGenerator } from "./FileImageGenerator";

describe(FileImageGenerator, () => {
    it("should return the data url of the native image returned by app.getFileIcon", async () => {
        const nativeImage = <NativeImage>{ toDataURL: () => "test data url" };
        const getFileIconMock = vi.fn().mockResolvedValue(nativeImage);
        const app = <App>{ getFileIcon: (p) => getFileIconMock(p) };

        const fileImageGenerator = new FileImageGenerator(app);

        expect(await fileImageGenerator.getImage("my file path")).toEqual(<Image>{ url: "test data url" });
    });
});
