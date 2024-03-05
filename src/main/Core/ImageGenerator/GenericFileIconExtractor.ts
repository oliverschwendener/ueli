import type { Image } from "@common/Core/Image";
import type { App } from "electron";
import type { FileIconExtractor } from "./FileIconExtractor";

export class GenericFileIconExtractor implements FileIconExtractor {
    public constructor(private readonly app: App) {}

    public matchesFilePath() {
        return true;
    }

    public async extractFileIcon(filePath: string) {
        const nativeImage = await this.app.getFileIcon(filePath);
        return { url: nativeImage.toDataURL() };
    }

    public async extractFileIcons(filePaths: string[]) {
        const result: Record<string, Image> = {};

        const promiseResults = await Promise.allSettled(filePaths.map((f) => this.extractFileIcon(f)));

        for (let i = 0; i < filePaths.length; i++) {
            const filePath = filePaths[i];
            const promiseResult = promiseResults[i];

            if (promiseResult.status === "fulfilled") {
                result[filePath] = promiseResult.value;
            }
        }

        return result;
    }
}
