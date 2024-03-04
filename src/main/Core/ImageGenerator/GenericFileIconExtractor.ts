import type { App } from "electron";
import type { FileIconExtractor } from "./FileIconExtractor";

export class GenericFileIconExtractor implements FileIconExtractor {
    public constructor(private readonly app: App) {}

    public machtes() {
        return true;
    }

    public async extractFileIcon(filePath: string) {
        const nativeImage = await this.app.getFileIcon(filePath);
        return { url: nativeImage.toDataURL() };
    }
}
