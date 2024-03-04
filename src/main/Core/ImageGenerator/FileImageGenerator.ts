import type { Image } from "@common/Core/Image";
import type { App } from "electron";
import type { FileImageGenerator as FileImageGeneratorInterface } from "./Contract";

export class FileImageGenerator implements FileImageGeneratorInterface {
    public constructor(private readonly app: App) {}

    public async getImage(filePath: string): Promise<Image> {
        const image = await this.app.getFileIcon(filePath);

        return { url: image.toDataURL() };
    }
}
