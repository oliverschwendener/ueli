import type { Image } from "@common/Core/Image";
import type { App, NativeImage } from "electron";
import { describe, expect, it, vi } from "vitest";
import { FileImageGenerator } from "./FileImageGenerator";

describe(FileImageGenerator, () => {
    it("should return the data image url from the file icon", async () => {
        const getFileIconMock = vi.fn().mockResolvedValue(<NativeImage>{ toDataURL: () => "dataUrlDummy" });
        const app = <App>{ getFileIcon: (p) => getFileIconMock(p) };

        const fileImageGenerator = new FileImageGenerator(app);

        expect(await fileImageGenerator.getImage("my file")).toEqual(<Image>{ url: "dataUrlDummy" });
        expect(getFileIconMock).toHaveBeenCalledWith("my file");
    });
});
