import type { Image } from "@common/Core/Image";
import type { FileImageGenerator as FileImageGeneratorInterface } from "./Contract";
import type { FileIconExtractor } from "./FileIconExtractor";

export class FileImageGenerator implements FileImageGeneratorInterface {
    public constructor(private readonly fileIconExtractors: FileIconExtractor[]) {}

    public async getImage(filePath: string): Promise<Image> {
        for (const fileIconExtractor of this.fileIconExtractors) {
            if (fileIconExtractor.machtes(filePath)) {
                return await fileIconExtractor.extractFileIcon(filePath);
            }
        }

        throw new Error(
            `Failed to extract file icon from path "${filePath}". Reason: file path did not match any file icon extractor`,
        );
    }

    public async getImages(filePaths: string[]): Promise<Record<string, Image>> {
        for (const fileIconExtractor of this.fileIconExtractors) {
            if (filePaths.every((filePath) => fileIconExtractor.machtes(filePath))) {
                return await fileIconExtractor.extractFileIcons(filePaths);
            }
        }

        throw new Error(`Failed to extract file icons. Reason: file paths did not match any file icon extractor`);
    }
}
